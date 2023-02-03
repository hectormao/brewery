import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreweryService } from './brewery/brewery.service';
import { BreweryController } from './brewery/brewery.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, BreweryController],
  providers: [AppService, BreweryService],
})
export class AppModule {}
