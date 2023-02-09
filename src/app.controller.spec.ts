import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectInfo = require('../package.json');

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return service', () => {
      const result = appController.getHello();
      expect(result.service).toBe(projectInfo.name);
      expect(result.version).toBe(projectInfo.version);
    });
  });
});
