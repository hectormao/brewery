import { Controller, Get, Query } from '@nestjs/common';
import { Brewery } from 'src/types/brewery.types';
import { BreweryService } from './brewery.service';

@Controller('brewery')
export class BreweryController {
  constructor(private readonly service: BreweryService) {}

  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('per_page') pageSize: number,
  ): Promise<Brewery[]> {
    const fixedPage = page && page >= 0 ? page : 0;
    const fixedPageSize = pageSize && pageSize > 0 ? pageSize : 10;

    return this.service.getPage(fixedPage, fixedPageSize);
  }
}
