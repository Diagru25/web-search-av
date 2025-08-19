import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CollectionUnit,
  CollectionUnitDocument,
} from './collection-unit.schema';
import {
  CreateCollectionUnitDto,
  UpdateCollectionUnitDto,
} from './dto/collection-unit.dto';

@Injectable()
export class CollectionUnitService {
  constructor(
    @InjectModel(CollectionUnit.name)
    private collectionUnitModel: Model<CollectionUnitDocument>,
  ) {}

  async create(
    createCollectionUnitDto: CreateCollectionUnitDto,
  ): Promise<CollectionUnit> {
    // Check if name already exists
    const existingUnit = await this.collectionUnitModel.findOne({
      name: createCollectionUnitDto.name,
    });
    if (existingUnit) {
      throw new ConflictException(
        'Collection unit with this name already exists',
      );
    }

    const collectionUnit = new this.collectionUnitModel(
      createCollectionUnitDto,
    );
    return collectionUnit.save();
  }

  async findAll(): Promise<CollectionUnit[]> {
    return this.collectionUnitModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<CollectionUnit> {
    const collectionUnit = await this.collectionUnitModel.findById(id).exec();
    if (!collectionUnit) {
      throw new NotFoundException('Collection unit not found');
    }
    return collectionUnit;
  }

  async update(
    id: string,
    updateCollectionUnitDto: UpdateCollectionUnitDto,
  ): Promise<CollectionUnit> {
    // Check if name already exists (excluding current record)
    if (updateCollectionUnitDto.name) {
      const existingUnit = await this.collectionUnitModel.findOne({
        name: updateCollectionUnitDto.name,
        _id: { $ne: id },
      });
      if (existingUnit) {
        throw new ConflictException(
          'Collection unit with this name already exists',
        );
      }
    }

    const updatedUnit = await this.collectionUnitModel
      .findByIdAndUpdate(id, updateCollectionUnitDto, { new: true })
      .exec();

    if (!updatedUnit) {
      throw new NotFoundException('Collection unit not found');
    }

    return updatedUnit;
  }

  async remove(id: string): Promise<void> {
    const result = await this.collectionUnitModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Collection unit not found');
    }
  }
}
