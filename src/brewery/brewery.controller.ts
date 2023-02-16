import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Brewery } from 'src/types/brewery.types';
import { BreweryService } from './brewery.service';

@ApiTags('brewery')
@Controller('brewery')
export class BreweryController {
  private readonly log: Logger = new Logger(BreweryController.name);

  constructor(private readonly service: BreweryService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Brewery,
    isArray: true,
    description: 'Obtiene las Cervecerias',
  })
  @ApiResponse({
    status: 500,
    description: 'Error desconocido',
  })
  @ApiQuery({
    name: 'page',
    description: 'Pagina a consultar',
    required: false,
  })
  @ApiQuery({
    name: 'per_page',
    description: 'Cantidad de items a consultar',
    required: false,
  })
  async getAll(
    @Query('page') page: number,
    @Query('per_page') pageSize: number,
  ): Promise<Brewery[]> {
    this.log.log(
      `Recibiendo solicitud de breweries page: ${page} per_page: ${pageSize}`,
    );

    if (isNaN(page)) {
      this.log.warn(`page param isn't number set the default value ${page}`);
    }

    if (isNaN(pageSize)) {
      this.log.warn(
        `pageSize param isn't number set the default value ${pageSize}`,
      );
    }

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
