import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getFileName = (req: any, file: any, callback: any) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${uuidv4()}${fileExtName}`);
};
