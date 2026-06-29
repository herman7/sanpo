import { Controller, Get } from '@nestjs/common';
import type { TestPingResponse } from '@sanpo/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Connectivity test endpoint called by the web app over the docker network
  @Get('api/ping')
  ping(): TestPingResponse {
    return {
      message: 'pong from nest-api!!',
      service: 'nest-api',
      timestamp: new Date().toISOString(),
    };
  }
}
