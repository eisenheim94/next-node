import { Injectable } from '@nestjs/common';

import type { HealthResponse } from './core/types';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'backend',
      timestamp: new Date().toISOString(),
    };
  }
}
