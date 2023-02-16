import { ApiProperty } from '@nestjs/swagger';

export class ServiceVersion {
  @ApiProperty({
    description: 'Nombre del servicio',
    type: String,
    example: 'brewery',
  })
  service: string;

  @ApiProperty({
    description: 'Version del servicio',
    type: String,
    example: '0.0.1',
  })
  version: string;
}
