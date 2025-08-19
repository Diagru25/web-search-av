import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionUnitDocument = CollectionUnit & Document;

@Schema({ timestamps: true })
export class CollectionUnit {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;
}

export const CollectionUnitSchema =
  SchemaFactory.createForClass(CollectionUnit);
