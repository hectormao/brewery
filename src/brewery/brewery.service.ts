import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Brewery } from 'src/types/brewery.types';
import { AxiosResponse } from 'axios';

@Injectable()
export class BreweryService {
  private readonly log: Logger = new Logger(BreweryService.name);
  private readonly baseUri = 'https://api.openbrewerydb.org/';

  constructor(private readonly httpService: HttpService) {}

  async getPage(page: number, pageSize: number): Promise<Brewery[]> {
    const url = `${this.baseUri}breweries?per_page=${pageSize}&page=${page}`;

    this.log.debug(`Consultando breweries url: ${url}`);

    const response: AxiosResponse<any[]> = await this.httpService.axiosRef.get(
      url,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': '*',
        },
      },
    );
    if (response.status !== HttpStatus.OK) {
      this.log.error(
        `Respuesta desde Open Brewery DB con status diferente de 200`,
        response,
      );
      throw new HttpException(response.data, response.status);
    }
    const breweries: Brewery[] = response.data.map((res) => ({
      id: res.id,
      name: res.name,
      city: res.city,
    }));
    return breweries;
  }
}
