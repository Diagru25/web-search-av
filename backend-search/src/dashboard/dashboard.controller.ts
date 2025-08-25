import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('top-collection-units')
  async getTopCollectionUnits() {
    return this.dashboardService.getTopCollectionUnits();
  }

  @Get('malware-by-days')
  async getMalwareByDays() {
    return this.dashboardService.getMalwareByDays();
  }
}
