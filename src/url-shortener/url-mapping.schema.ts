import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class UrlMapping {
  @Prop()
  longUrl: string;

  @Prop()
  shortUrl: string;

  @Prop()
  accessTime: Date[];

  @Prop({ default: 0 })
  accessCount: number;
}

export const UrlMappingSchema = SchemaFactory.createForClass(UrlMapping);
