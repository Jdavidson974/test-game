import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('game')
  @Render('test')
  game(@Param() body) {
    console.log(body);
    // const idCampagne = body.id;
    // FAIRE UN FIND ICI Pour recupere le folder
    const folderfind = "bk";
    console.log(folderfind);

    return { folder: folderfind }
  }
}
