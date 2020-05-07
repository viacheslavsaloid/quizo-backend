import { Controller, Post, Logger, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import path = require('path');

export interface Media {
  path: string;
}

@Controller()
export class ImagesController {
  logger = new Logger('Images Controller');

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  postImage(@UploadedFile() file): Media {
    return { path: file.filename };
  }

  @Get('/:id')
  getImage(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(id);
    return res.sendFile(id, { root: path.join('media') });
  }
}
