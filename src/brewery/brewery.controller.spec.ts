import { Test, TestingModule } from '@nestjs/testing';
import { BreweryController } from './brewery.controller';

describe('BreweryController', () => {
  let controller: BreweryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreweryController],
    }).compile();

    controller = module.get<BreweryController>(BreweryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
