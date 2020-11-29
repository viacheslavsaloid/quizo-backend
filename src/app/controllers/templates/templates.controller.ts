import { Controller, Post, Logger, UseInterceptors, Get, Param, Res, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import path = require('path');

export interface Media {
  path: string;
}

@Controller()
export class TemplatesController {
  logger = new Logger('Templates Controller');

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  postFiles(@UploadedFiles() files): Media {
    console.log('files', files);
    return files.map(file => file.filename);
  }

  @Get('/:id')
  getFile(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(id);
    return res.sendFile(id, { root: path.join('templates') });
  }
}
