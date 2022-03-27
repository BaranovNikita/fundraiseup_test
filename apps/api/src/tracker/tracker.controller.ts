import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  ParseArrayPipe,
  Post,
  Res,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { SaveEventsDto } from './tracker.dto';
import { TrackerEvent } from './tracker.types';
import { JsonParsePipe } from '../json-parse.pipe';

@Controller()
export class TrackerController {
  constructor(private trackerService: TrackerService) {}

  @Header('Content-Type', 'application/javascript')
  @Get('/')
  getTrackerContent(@Res() res): void {
    const file = this.trackerService.getContent();
    file.pipe(res);
  }

  @Post('/track')
  @HttpCode(200)
  async saveEvents(
    @Body(new JsonParsePipe(), new ParseArrayPipe({ items: SaveEventsDto }))
    events: SaveEventsDto[],
  ): Promise<void> {
    this.trackerService.saveEvents(events as TrackerEvent[]);
  }
}
