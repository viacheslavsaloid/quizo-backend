import { Controller, Post, Logger, UseInterceptors, Get, Param, Res, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import path = require('path');

export interface Media {
  path: string;
}

@Controller()
export class ImagesController {
  logger = new Logger('Images Controller');

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  postImage(@UploadedFiles() files): Media {
    return files.map(file => file.filename);
  }

  @Get('/:id')
  getImage(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(id);
    return res.sendFile(id, { root: path.join('media') });
  }
}
