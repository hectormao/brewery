import { Injectable } from '@nestjs/common';
import { ServiceVersion } from './types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectInfo = require('../package.json');

@Injectable()
export class AppService {
  getHello(): ServiceVersion {
    return {
      service: projectInfo.name,
      version: projectInfo.version,
    } as ServiceVersion;
  }
}
