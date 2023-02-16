import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Servicio de prueba Brewery')
    .setDescription('API de cervecerias')
    .setVersion('0.0.0')
    .addTag('brewery')
    .addTag('service version')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env['NEST_PORT'] || 3000);
}
bootstrap();
