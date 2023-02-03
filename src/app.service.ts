import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectInfo = require('../package.json');

@Injectable()
export class AppService {
  getHello(): any {
    return {
      service: projectInfo.name,
      version: projectInfo.version,
    };
  }
}
