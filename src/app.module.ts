import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreweryService } from './brewery/brewery.service';
import { BreweryController } from './brewery/brewery.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, BreweryController],
  providers: [AppService, BreweryService],
})
export class AppModule {}
