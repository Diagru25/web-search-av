const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const {
  CollectionUnitService,
} = require('../dist/src/collection-unit/collection-unit.service');

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
          name: 'Bệnh viện 175',
          description: '',
          createdAt: new Date('2028-11-01T00:00:00.000Z'),
          updatedAt: new Date('2028-11-01T00:00:00.000Z'),
        },
        {
          name: 'Binh chủng Công Binh',
          description: '',
          createdAt: new Date('2028-11-02T00:00:00.000Z'),
          updatedAt: new Date('2028-11-02T00:00:00.000Z'),
        },
        // Add more units as needed
      ];

      for (const unit of defaultUnits) {
        await collectionUnitService.create(unit);
        console.log(`Created collection unit: ${unit.name}`);
      }

      console.log('Collection units seeded successfully');
    } else {
      console.log('Collection units already exist, skipping seed');
    }
  } catch (error) {
    console.error(
      'Error seeding collection units:',
      error instanceof Error ? error.message : error,
    );
  } finally {
    await app.close();
  }
}

seed();
