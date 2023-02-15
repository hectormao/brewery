import { HttpModule } from '@nestjs/axios';
import {
  CacheModule,
  CacheModuleOptions,
  CacheStore,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BreweryService } from './brewery/brewery.service';
import { BreweryController } from './brewery/brewery.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore, RedisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const customStore: RedisStore = await redisStore({
          url: configService.get<string>('CACHE_REDIS_URL'),
          ttl: Number(configService.get<string>('CACHE_TTL')),
        });

        const options: CacheModuleOptions<RedisClientOptions> = {
          store: customStore as unknown as CacheStore,
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, BreweryController],
  providers: [AppService, BreweryService],
})
export class AppModule {}
