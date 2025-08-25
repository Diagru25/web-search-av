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
        {
          name: 'Binh chủng Đặc công',
          description: '',
          createdAt: new Date('2028-11-03T00:00:00.000Z'),
          updatedAt: new Date('2028-11-03T00:00:00.000Z'),
        },
        {
          name: 'Binh chủng Hóa học',
          description: '',
          createdAt: new Date('2028-11-04T00:00:00.000Z'),
          updatedAt: new Date('2028-11-04T00:00:00.000Z'),
        },
        {
          name: 'Binh chủng Pháo Binh',
          description: '',
          createdAt: new Date('2028-11-05T00:00:00.000Z'),
          updatedAt: new Date('2028-11-05T00:00:00.000Z'),
        },
        {
          name: 'Binh chủng Tăng thiết giáp',
          description: '',
          createdAt: new Date('2028-11-06T00:00:00.000Z'),
          updatedAt: new Date('2028-11-06T00:00:00.000Z'),
        },
        {
          name: 'Binh chủng Thông tin Liên lạc',
          description: '',
          createdAt: new Date('2028-11-07T00:00:00.000Z'),
          updatedAt: new Date('2028-11-07T00:00:00.000Z'),
        },
        {
          name: 'Binh doan 12',
          description: '',
          createdAt: new Date('2028-11-08T00:00:00.000Z'),
          updatedAt: new Date('2028-11-08T00:00:00.000Z'),
        },
        {
          name: 'Bộ Tổng Tham mưu',
          description: 'Bộ Tổng Tham mưu',
          createdAt: new Date('2028-11-09T00:00:00.000Z'),
          updatedAt: new Date('2028-11-09T00:00:00.000Z'),
        },
        {
          name: 'BỘ TỔNG THAM MƯU 2',
          description: 'BỘ TỔNG THAM MƯU 2',
          createdAt: new Date('2028-11-10T00:00:00.000Z'),
          updatedAt: new Date('2028-11-10T00:00:00.000Z'),
        },
        {
          name: 'Bộ Tư lệnh Biên phòng',
          description: '',
          createdAt: new Date('2028-11-11T00:00:00.000Z'),
          updatedAt: new Date('2028-11-11T00:00:00.000Z'),
        },
        {
          name: 'Bộ Tư Lệnh Cảnh sát biển',
          description: '',
          createdAt: new Date('2028-11-12T00:00:00.000Z'),
          updatedAt: new Date('2028-11-12T00:00:00.000Z'),
        },
        {
          name: 'Bộ Tư lệnh Lăng',
          description: '',
          createdAt: new Date('2028-11-13T00:00:00.000Z'),
          updatedAt: new Date('2028-11-13T00:00:00.000Z'),
        },
        {
          name: 'Bộ Tư lệnh Tác Chiến Không gian mạng',
          description: '',
          createdAt: new Date('2028-11-14T00:00:00.000Z'),
          updatedAt: new Date('2028-11-14T00:00:00.000Z'),
        },
        {
          name: 'Bộ tư lệnh Thủ đô',
          description: '',
          createdAt: new Date('2028-11-15T00:00:00.000Z'),
          updatedAt: new Date('2028-11-15T00:00:00.000Z'),
        },
        {
          name: 'CƠ QUAN BỘ QUỐC PHÒNG',
          description: 'CƠ QUAN BỘ QUỐC PHÒNG',
          createdAt: new Date('2028-11-16T00:00:00.000Z'),
          updatedAt: new Date('2028-11-16T00:00:00.000Z'),
        },
        {
          name: 'đươn vị 1',
          description: '',
          createdAt: new Date('2028-11-17T00:00:00.000Z'),
          updatedAt: new Date('2028-11-17T00:00:00.000Z'),
        },
        {
          name: 'Học viện Chính trị',
          description: '',
          createdAt: new Date('2028-11-18T00:00:00.000Z'),
          updatedAt: new Date('2028-11-18T00:00:00.000Z'),
        },
        {
          name: 'Học viện Hậu Cần',
          description: '',
          createdAt: new Date('2028-11-19T00:00:00.000Z'),
          updatedAt: new Date('2028-11-19T00:00:00.000Z'),
        },
        {
          name: 'Học viện Kĩ thuật Quân sự',
          description: '',
          createdAt: new Date('2028-11-20T00:00:00.000Z'),
          updatedAt: new Date('2028-11-20T00:00:00.000Z'),
        },
        {
          name: 'Học viện Lục quân',
          description: '',
          createdAt: new Date('2028-11-21T00:00:00.000Z'),
          updatedAt: new Date('2028-11-21T00:00:00.000Z'),
        },
        {
          name: 'Học viện Quân Y',
          description: '',
          createdAt: new Date('2028-11-22T00:00:00.000Z'),
          updatedAt: new Date('2028-11-22T00:00:00.000Z'),
        },
        {
          name: 'Học viện Quốc Phòng',
          description: '',
          createdAt: new Date('2028-11-23T00:00:00.000Z'),
          updatedAt: new Date('2028-11-23T00:00:00.000Z'),
        },
        {
          name: 'Quân chủng Hải Quân',
          description: '',
          createdAt: new Date('2028-11-24T00:00:00.000Z'),
          updatedAt: new Date('2028-11-24T00:00:00.000Z'),
        },
        {
          name: 'Quân chủng Phòng không Không quân',
          description: '',
          createdAt: new Date('2028-11-25T00:00:00.000Z'),
          updatedAt: new Date('2028-11-25T00:00:00.000Z'),
        },
        {
          name: 'Quân đoàn 1',
          description: '',
          createdAt: new Date('2028-11-26T00:00:00.000Z'),
          updatedAt: new Date('2028-11-26T00:00:00.000Z'),
        },
        {
          name: 'Quân đoàn 2',
          description: '',
          createdAt: new Date('2028-11-27T00:00:00.000Z'),
          updatedAt: new Date('2028-11-27T00:00:00.000Z'),
        },
        {
          name: 'Quân đoàn 34',
          description: '',
          createdAt: new Date('2028-11-28T00:00:00.000Z'),
          updatedAt: new Date('2028-11-28T00:00:00.000Z'),
        },
        {
          name: 'Quân đoàn 4',
          description: '',
          createdAt: new Date('2028-11-29T00:00:00.000Z'),
          updatedAt: new Date('2028-11-29T00:00:00.000Z'),
        },
        {
          name: 'QUÂN KHU 1',
          description: 'QUÂN KHU 1',
          createdAt: new Date('2028-11-30T00:00:00.000Z'),
          updatedAt: new Date('2028-11-30T00:00:00.000Z'),
        },
        {
          name: 'Quân khu 2',
          description: '',
          createdAt: new Date('2028-12-01T00:00:00.000Z'),
          updatedAt: new Date('2028-12-01T00:00:00.000Z'),
        },
        {
          name: 'QUÂN KHU 3',
          description: 'QUÂN KHU 3',
          createdAt: new Date('2028-12-02T00:00:00.000Z'),
          updatedAt: new Date('2028-12-02T00:00:00.000Z'),
        },
        {
          name: 'Quân khu 4',
          description: '',
          createdAt: new Date('2028-12-03T00:00:00.000Z'),
          updatedAt: new Date('2028-12-03T00:00:00.000Z'),
        },
        {
          name: 'Quân khu 5',
          description: '',
          createdAt: new Date('2028-12-04T00:00:00.000Z'),
          updatedAt: new Date('2028-12-04T00:00:00.000Z'),
        },
        {
          name: 'Quân khu 7',
          description: '',
          createdAt: new Date('2028-12-05T00:00:00.000Z'),
          updatedAt: new Date('2028-12-05T00:00:00.000Z'),
        },
        {
          name: 'Quân khu 9',
          description: '',
          createdAt: new Date('2028-12-06T00:00:00.000Z'),
          updatedAt: new Date('2028-12-06T00:00:00.000Z'),
        },
        {
          name: 'Tổng cục 2',
          description: '',
          createdAt: new Date('2028-12-07T00:00:00.000Z'),
          updatedAt: new Date('2028-12-07T00:00:00.000Z'),
        },
        {
          name: 'Tổng cục Chính trị',
          description: '',
          createdAt: new Date('2028-12-08T00:00:00.000Z'),
          updatedAt: new Date('2028-12-08T00:00:00.000Z'),
        },
        {
          name: 'Tổng Cục Công Nghiệp Quốc Phòng',
          description: 'Tổng Cục Công Nghiệp Quốc Phòng',
          createdAt: new Date('2028-12-09T00:00:00.000Z'),
          updatedAt: new Date('2028-12-09T00:00:00.000Z'),
        },
        {
          name: 'Tổng Cục Hậu Cần',
          description: 'Tổng Cục Hậu Cần',
          createdAt: new Date('2028-12-10T00:00:00.000Z'),
          updatedAt: new Date('2028-12-10T00:00:00.000Z'),
        },
        {
          name: 'Tổng cục Kỹ Thuật',
          description: '',
          createdAt: new Date('2028-12-11T00:00:00.000Z'),
          updatedAt: new Date('2028-12-11T00:00:00.000Z'),
        },
        {
          name: 'Tổng cục Kỹ thuật miền bắc',
          description: '',
          createdAt: new Date('2028-12-12T00:00:00.000Z'),
          updatedAt: new Date('2028-12-12T00:00:00.000Z'),
        },
        {
          name: 'Trung tâm Nhiệt đới Việt Nga',
          description: 'Trung tâm Nhiệt đới Việt Nga',
          createdAt: new Date('2028-12-13T00:00:00.000Z'),
          updatedAt: new Date('2028-12-13T00:00:00.000Z'),
        },
        {
          name: 'Trường Sĩ quan Chính trị',
          description: '',
          createdAt: new Date('2028-12-14T00:00:00.000Z'),
          updatedAt: new Date('2028-12-14T00:00:00.000Z'),
        },
        {
          name: 'Trường Sĩ quan Lục quân 1',
          description: '',
          createdAt: new Date('2028-12-15T00:00:00.000Z'),
          updatedAt: new Date('2028-12-15T00:00:00.000Z'),
        },
        {
          name: 'Trường Sĩ quan lục quân 2',
          description: '',
          createdAt: new Date('2028-12-16T00:00:00.000Z'),
          updatedAt: new Date('2028-12-16T00:00:00.000Z'),
        },
        {
          name: 'Viện Chiến Lược Quốc phòng',
          description: '',
          createdAt: new Date('2028-12-17T00:00:00.000Z'),
          updatedAt: new Date('2028-12-17T00:00:00.000Z'),
        },
        {
          name: 'Viện Khoa học và Công nghệ quân sự',
          description: '',
          createdAt: new Date('2028-12-18T00:00:00.000Z'),
          updatedAt: new Date('2028-12-18T00:00:00.000Z'),
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
