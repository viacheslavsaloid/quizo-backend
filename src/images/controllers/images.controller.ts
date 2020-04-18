import { Controller, Post, Logger, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import path = require('path');

@Controller()
export class ImagesController {
  logger = new Logger('Images Controller');

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  postImage(@UploadedFile() file): string {
    return file.filename;
  }

  @Get('/:id')
  getImage(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(id);
    return res.sendFile(id, { root: path.join('images') });
  }
}
