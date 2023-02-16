import { ApiProperty } from '@nestjs/swagger';

export class Brewery {
  @ApiProperty({
    description: 'Identificador de la cerveceria',
    type: String,
    example: '10-56-brewing-company-knox',
  })
  id: string;
  @ApiProperty({
    description: 'Nombre de la cerveceria',
    type: String,
    example: '10-56 Brewing Company',
  })
  name: string;
  @ApiProperty({
    description: 'Ciudad de la cerveceria',
    type: String,
    example: 'Knox',
  })
  city: string;
}
