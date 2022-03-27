import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class FrontendController {
  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get('/1.html')
  @Render('index')
  one() {
    return;
  }

  @Get('/2.html')
  @Render('index')
  two() {
    return;
  }
}
