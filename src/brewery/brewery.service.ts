import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Brewery } from 'src/types/brewery.types';
import { AxiosResponse } from 'axios';

@Injectable()
export class BreweryService {
  private readonly baseUri = 'https://api.openbrewerydb.org/';

  constructor(private readonly httpService: HttpService) {}

  async getPage(page: number, pageSize: number): Promise<Brewery[]> {
    const url = `${this.baseUri}breweries?per_page=${pageSize}&page=${page}`;
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
