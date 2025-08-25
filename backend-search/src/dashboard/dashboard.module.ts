import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Malware, MalwareSchema } from '../malware/malware.schema';
import {
  CollectionUnit,
  CollectionUnitSchema,
} from '../collection-unit/collection-unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Malware.name, schema: MalwareSchema },
      { name: CollectionUnit.name, schema: CollectionUnitSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
