import { HttpModule } from '@nestjs/axios';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Brewery } from 'src/types/brewery.types';
import { BreweryController } from './brewery.controller';
import { BreweryService } from './brewery.service';

const mockResult: any[] = [
  {
    id: '10-56-brewing-company-knox-test',
    name: '10-56 Brewing Company',
    city: 'Knox',
  },
  {
    id: '10-barrel-brewing-co-bend-1-test',
    name: '10 Barrel Brewing Co',
    city: 'Bend',
  },
  {
    id: '10-barrel-brewing-co-bend-2-test',
    name: '10 Barrel Brewing Co',
    city: 'Bend',
  },
];

describe('BreweryController', () => {
  let controller: BreweryController;
  let service: BreweryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot(), CacheModule.register()],
      controllers: [BreweryController],
      providers: [BreweryService],
    }).compile();

    controller = module.get<BreweryController>(BreweryController);
    service = module.get<BreweryService>(BreweryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAll Successfull without params', async () => {
    const testPage = null;
    const testPageSize = null;

    jest
      .spyOn(service, 'getPage')
      .mockImplementation(async (page: number, pageSize: number) => {
        expect(page).toBe(0);
        expect(pageSize).toBe(10);
        return mockResult;
      });
    const result: Brewery[] = await controller.getAll(testPage, testPageSize);
    expect(result.length).toBe(3);
  });

  it('getAll Successfull with negative params', async () => {
    const testPage = -1;
    const testPageSize = 0;

    jest
      .spyOn(service, 'getPage')
      .mockImplementation(async (page: number, pageSize: number) => {
        expect(page).toBe(0);
        expect(pageSize).toBe(10);
        return mockResult;
      });
    const result: Brewery[] = await controller.getAll(testPage, testPageSize);
    expect(result.length).toBe(3);
  });

  it('getAll Successfull with string params', async () => {
    const testPage = '12X';
    const testPageSize = '50Y';

    jest
      .spyOn(service, 'getPage')
      .mockImplementation(async (page: number, pageSize: number) => {
        expect(page).toBe(0);
        expect(pageSize).toBe(10);
        return mockResult;
      });
    const result: Brewery[] = await controller.getAll(
      testPage as unknown as number,
      testPageSize as unknown as number,
    );
    expect(result.length).toBe(3);
  });

  it('getAll Successfull with ok params', async () => {
    const testPage = 5;
    const testPageSize = 20;

    jest
      .spyOn(service, 'getPage')
      .mockImplementation(async (page: number, pageSize: number) => {
        expect(page).toBe(testPage);
        expect(pageSize).toBe(testPageSize);
        return mockResult;
      });
    const result: Brewery[] = await controller.getAll(testPage, testPageSize);
    expect(result.length).toBe(3);
  });

  it('getAll Service Failed', async () => {
    const testPage = 5;
    const testPageSize = 20;

    jest
      .spyOn(service, 'getPage')
      .mockImplementation(async (page: number, pageSize: number) => {
        expect(page).toBe(testPage);
        expect(pageSize).toBe(testPageSize);
        throw new HttpException('Test Error', HttpStatus.FAILED_DEPENDENCY);
      });
    try {
      await controller.getAll(testPage, testPageSize);
      throw Error('Test must be failed');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.FAILED_DEPENDENCY);
    }
  });
});
