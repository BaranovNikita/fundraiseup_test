import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({
  collection: 'tracks',
})
export class Track {
  @Prop({
    index: true,
  })
  event: string;

  @Prop(Date)
  ts: Date;

  @Prop([String])
  tags: string[];

  @Prop({
    index: true,
  })
  url: string;

  @Prop()
  title: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
