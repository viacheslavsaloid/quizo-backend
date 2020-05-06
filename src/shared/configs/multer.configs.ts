import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
    return callback(new Error('You have to upload jpg|jpeg|png|mp4!'), false);
  }

  callback(null, true);
};

const fileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const MULTER_CONFIGS: MulterOptions = {
  storage: diskStorage({
    destination: './media',
    filename: fileName
  }),
  fileFilter
};
