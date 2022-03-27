import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import * as path from 'path';
import { TrackerEvent } from './tracker.types';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel(Track.name) private catModel: Model<TrackDocument>,
  ) {}

  getContent(): ReadStream {
    return createReadStream(path.join(__dirname, 'tracker.js'));
  }

  async saveEvents(events: TrackerEvent[]): Promise<void> {
    await this.catModel.insertMany(events);
  }
}
