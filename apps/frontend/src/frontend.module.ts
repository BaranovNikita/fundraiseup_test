import { Module } from '@nestjs/common';
import { FrontendController } from './frontend.controller';

@Module({
  imports: [],
  controllers: [FrontendController],
})
export class FrontendModule {}
