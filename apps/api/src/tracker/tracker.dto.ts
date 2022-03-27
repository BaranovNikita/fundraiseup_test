import { IsDateString, IsString, IsUrl } from 'class-validator';

export class SaveEventsDto {
  @IsString()
  event: string;

  @IsString({ each: true })
  tags: string[];

  @IsUrl({
    require_tld: false,
  })
  url: string;

  @IsString()
  title: string;

  @IsDateString()
  ts: string;
}
