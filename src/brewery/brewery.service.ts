import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BreweryService {
  constructor(private readonly httpService: HttpService) {}
}
