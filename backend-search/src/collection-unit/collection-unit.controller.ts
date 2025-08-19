import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CollectionUnitService } from './collection-unit.service';
import {
  CreateCollectionUnitDto,
  UpdateCollectionUnitDto,
} from './dto/collection-unit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('collection-units')
@UseGuards(JwtAuthGuard)
export class CollectionUnitController {
  constructor(private readonly collectionUnitService: CollectionUnitService) {}

  @Post()
  create(@Body() createCollectionUnitDto: CreateCollectionUnitDto) {
    return this.collectionUnitService.create(createCollectionUnitDto);
  }

  @Get()
  findAll() {
    return this.collectionUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionUnitService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionUnitDto: UpdateCollectionUnitDto,
  ) {
    return this.collectionUnitService.update(id, updateCollectionUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionUnitService.remove(id);
  }
}
