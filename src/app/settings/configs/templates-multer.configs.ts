import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(html)$/)) {
    return callback(new Error('You have to upload html!'), false);
  }

  callback(null, true);
};

const fileName = (req, file, callback) => {
  callback(null, file.originalname);
};

export const TEMPLATE_MULTER_CONFIGS: MulterOptions = {
  storage: diskStorage({
    destination: './templates',
    filename: fileName
  }),
  fileFilter
};
