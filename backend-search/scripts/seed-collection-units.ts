import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CollectionUnitService } from '../src/collection-unit/collection-unit.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const collectionUnitService = app.get(CollectionUnitService);

  try {
    // Check if any collection units exist
    const existingUnits = await collectionUnitService.findAll();

    if (existingUnits.length === 0) {
      console.log('Seeding collection units...');

      const defaultUnits = [
        {
          name: 'IT Security',
          description: 'Đơn vị An ninh thông tin',
        },
        {
          name: 'Research Lab',
          description: 'Phòng nghiên cứu',
        },
        {
          name: 'External',
          description: 'Nguồn bên ngoài',
        },
        {
          name: 'Threat Intelligence',
          description: 'Đơn vị Tình báo Mối đe dọa',
        },
      ];

      for (const unit of defaultUnits) {
        await collectionUnitService.create(unit);
        console.log(`Created collection unit: ${unit.name}`);
      }

      console.log('Collection units seeded successfully!');
    } else {
      console.log('Collection units already exist. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding collection units:', error);
  } finally {
    await app.close();
  }
}

seed();
