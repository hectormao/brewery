import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ServiceVersion } from './types/types';

@ApiTags('service version')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ServiceVersion,
    description: 'Obtiene la version del servicio',
  })
  getHello(): ServiceVersion {
    return this.appService.getHello();
  }
}
