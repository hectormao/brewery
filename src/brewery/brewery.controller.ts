import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Brewery } from 'src/types/brewery.types';
import { BreweryService } from './brewery.service';

@Controller('brewery')
export class BreweryController {
  private readonly log: Logger = new Logger(BreweryController.name);

  constructor(private readonly service: BreweryService) {}

  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('per_page') pageSize: number,
  ): Promise<Brewery[]> {
    this.log.log(
      `Recibiendo solicitud de breweries page: ${page} per_page: ${pageSize}`,
    );
    const fixedPage = page && page >= 0 ? page : 0;
    const fixedPageSize = pageSize && pageSize > 0 ? pageSize : 10;
    const result: Brewery[] = await this.service.getPage(
      fixedPage,
      fixedPageSize,
    );
    this.log.log(`Respondiendo breweries cantidad: ${result.length}`);
    return result;
  }
}
