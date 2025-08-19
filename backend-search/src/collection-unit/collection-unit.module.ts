import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionUnitController } from './collection-unit.controller';
import { CollectionUnitService } from './collection-unit.service';
import { CollectionUnit, CollectionUnitSchema } from './collection-unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionUnit.name, schema: CollectionUnitSchema },
    ]),
  ],
  controllers: [CollectionUnitController],
  providers: [CollectionUnitService],
  exports: [CollectionUnitService],
})
export class CollectionUnitModule {}
