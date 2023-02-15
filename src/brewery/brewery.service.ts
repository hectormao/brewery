import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Brewery } from 'src/types/brewery.types';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import CircuitBreaker from 'opossum';

@Injectable()
export class BreweryService {
  private readonly log: Logger = new Logger(BreweryService.name);

  private readonly breweryCB: CircuitBreaker;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    const cbOptions: CircuitBreaker.Options = {
      name: 'BreweryCB',
      timeout: this.configService.get<number>('CB_TIMEOUT') || 3000,
      errorThresholdPercentage:
        this.configService.get<number>('CB_ERROR_PERCENTAGE') || 50,
      resetTimeout: this.configService.get<number>('CB_RESET_TIMEOUT') || 30000,
    };

    this.breweryCB = new CircuitBreaker(
      (page: number, peageSize: number) =>
        this.callOpenbreweryService(page, peageSize),
      cbOptions,
    ).fallback(() => []);
  }

  async getPage(page: number, pageSize: number): Promise<Brewery[]> {
    return this.breweryCB.fire(page, pageSize) as Promise<Brewery[]>;
  }

  async callOpenbreweryService(
    page: number,
    pageSize: number,
  ): Promise<Brewery[]> {
    const baseUri = this.configService.get<string>('OPEN_BREWERY_DB_URL');

    const url = `${baseUri}${this.configService.get<string>(
      'BREWERIES_PATH',
    )}?per_page=${pageSize}&page=${page}`;

    const cacheResult = await this.cacheManager.get(url);
    if (cacheResult) {
      return cacheResult as Brewery[];
    }

    this.log.debug(`Consultando breweries url: ${url}`);

    const response: AxiosResponse<any[]> = await this.httpService.axiosRef.get(
      url,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': '*',
        },
        validateStatus: () => true,
      },
    );

    if (response.status !== HttpStatus.OK) {
      this.log.error(
        `Respuesta desde Open Brewery DB con status diferente de 200 status: ${response.status}`,
      );
      throw new HttpException(response.data, response.status);
    }

    const breweries: Brewery[] = response.data.map((res) => ({
      id: res.id,
      name: res.name,
      city: res.city,
    }));
    await this.cacheManager.set(url, breweries);
    return breweries;
  }
}
