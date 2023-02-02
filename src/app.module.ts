import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreweryService } from './brewery/brewery.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, BreweryService],
})
export class AppModule {}
