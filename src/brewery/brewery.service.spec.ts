import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Brewery } from 'src/types/brewery.types';
import { BreweryService } from './brewery.service';

const mockResult: any[] = [
  {
    id: '10-56-brewing-company-knox-test',
    name: '10-56 Brewing Company',
    brewery_type: 'micro',
    street: '400 Brown Cir',
    address_2: null,
    address_3: null,
    city: 'Knox',
    state: 'Indiana',
    county_province: null,
    postal_code: '46534',
    country: 'United States',
    longitude: '-86.627954',
    latitude: '41.289715',
    phone: '6308165790',
    website_url: null,
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
  {
    id: '10-barrel-brewing-co-bend-1-test',
    name: '10 Barrel Brewing Co',
    brewery_type: 'large',
    street: '62970 18th St',
    address_2: null,
    address_3: null,
    city: 'Bend',
    state: 'Oregon',
    county_province: null,
    postal_code: '97701-9847',
    country: 'United States',
    longitude: '-121.28170597038259',
    latitude: '44.08683530625218',
    phone: '5415851007',
    website_url: 'http://www.10barrel.com',
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
  {
    id: '10-barrel-brewing-co-bend-2-test',
    name: '10 Barrel Brewing Co',
    brewery_type: 'large',
    street: '1135 NW Galveston Ave Ste B',
    address_2: null,
    address_3: null,
    city: 'Bend',
    state: 'Oregon',
    county_province: null,
    postal_code: '97703-2465',
    country: 'United States',
    longitude: '-121.32880209261799',
    latitude: '44.057564901366796',
    phone: '5415851007',
    website_url: null,
    updated_at: '2023-01-04T04:46:02.393Z',
    created_at: '2023-01-04T04:46:02.393Z',
  },
];

describe('BreweryService', () => {
  let service: BreweryService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [BreweryService],
    }).compile();

    service = module.get<BreweryService>(BreweryService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getPage Successfull', async () => {
    const pageSize = 3;
    const page = 0;
    jest.spyOn(httpService.axiosRef, 'get').mockImplementation(async (url) => {
      expect(url).toBe(
        `https://api.openbrewerydb.org/breweries?per_page=${pageSize}&page=${page}`,
      );
      return {
        status: HttpStatus.OK,
        data: mockResult,
      };
    });

    const result: Brewery[] = await service.getPage(page, pageSize);
    expect(result.length).toBe(3);
    expect(result[0].id).toBe(mockResult[0].id);
  });

  it('getPage HttpService Failed', async () => {
    const testMessage = 'Test Error';
    jest.spyOn(httpService.axiosRef, 'get').mockImplementation(async () => {
      throw new HttpException(testMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    });
    try {
      await service.getPage(0, 3);
      throw new Error('Test must be failed');
    } catch (error) {
      expect(error.message).toBe(testMessage);
    }
  });

  it('getPage HttpService Replies with status code 400', async () => {
    const pageSize = 3;
    const page = 0;
    jest.spyOn(httpService.axiosRef, 'get').mockImplementation(async (url) => {
      expect(url).toBe(
        `https://api.openbrewerydb.org/breweries?per_page=${pageSize}&page=${page}`,
      );
      return {
        status: HttpStatus.BAD_REQUEST,
        data: { error: 'test error' },
      };
    });

    try {
      await service.getPage(page, pageSize);
      throw new Error('Test must be failed');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});
