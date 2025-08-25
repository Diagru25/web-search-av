import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Malware, MalwareDocument } from '../malware/malware.schema';
import {
  CollectionUnit,
  CollectionUnitDocument,
} from '../collection-unit/collection-unit.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Malware.name) private malwareModel: Model<MalwareDocument>,
    @InjectModel(CollectionUnit.name)
    private collectionUnitModel: Model<CollectionUnitDocument>,
  ) {}

  async getDashboardStats() {
    // Tổng mã độc
    const totalMalware = await this.malwareModel.countDocuments();

    // Tổng số đơn vị
    const totalCollectionUnits =
      await this.collectionUnitModel.countDocuments();

    // Cập nhật trong tháng (số mã độc được thêm mới trong tháng)
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const malwareThisMonth = await this.malwareModel.countDocuments({
      collectionDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    // Cập nhật gần đây (thời gian mã độc được tạo mới hoặc chỉnh sửa gần nhất)
    const latestMalware = await this.malwareModel
      .findOne()
      .sort({ updatedAt: -1 })
      .select('updatedAt createdAt');

    let timeAgo = null;
    let timeUnit = 'giờ';
    if (latestMalware) {
      const latestUpdateTime =
        (latestMalware as any).updatedAt || (latestMalware as any).createdAt;
      const timeDiff = currentDate.getTime() - latestUpdateTime.getTime();

      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      const hoursAgo = Math.floor(timeDiff / (1000 * 3600));
      const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysAgo > 0) {
        timeAgo = daysAgo;
        timeUnit = 'ngày';
      } else if (hoursAgo > 0) {
        timeAgo = hoursAgo;
        timeUnit = 'giờ';
      } else if (minutesAgo > 0) {
        timeAgo = minutesAgo;
        timeUnit = 'phút';
      } else {
        timeAgo = 1;
        timeUnit = 'phút';
      }
    }

    return {
      totalMalware,
      totalCollectionUnits,
      malwareThisMonth,
      lastUpdateValue: timeAgo,
      lastUpdateUnit: timeUnit,
    };
  }

  async getTopCollectionUnits() {
    // Lấy tất cả collection units
    const allUnits = await this.collectionUnitModel.find().select('name');

    // Thống kê số lượng malware cho mỗi unit
    const malwareStats = await this.malwareModel.aggregate([
      {
        $group: {
          _id: '$collectionUnit',
          count: { $sum: 1 },
        },
      },
    ]);

    // Tạo map để dễ lookup
    const statsMap = new Map();
    malwareStats.forEach((stat) => {
      statsMap.set(stat._id.toString(), stat.count);
    });

    // Tạo kết quả với tất cả units, kể cả những unit có count = 0
    const result = allUnits.map((unit) => ({
      name: unit.name,
      count: statsMap.get((unit._id as any).toString()) || 0,
    }));

    // Sắp xếp theo count giảm dần và lấy top 5
    result.sort((a, b) => b.count - a.count);

    return result.slice(0, 5);
  }

  async getMalwareByDays() {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 6); // 7 ngày bao gồm hôm nay

    const dailyStats = await this.malwareModel.aggregate([
      {
        $match: {
          collectionDate: {
            $gte: sevenDaysAgo,
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$collectionDate' },
            month: { $month: '$collectionDate' },
            day: { $dayOfMonth: '$collectionDate' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    // Tạo mảng 7 ngày với giá trị mặc định là 0
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);

      const dayData = dailyStats.find((stat) => {
        return (
          stat._id.year === date.getFullYear() &&
          stat._id.month === date.getMonth() + 1 &&
          stat._id.day === date.getDate()
        );
      });

      result.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        count: dayData ? dayData.count : 0,
      });
    }

    return result;
  }
}
