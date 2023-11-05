import { BadRequestException } from '@nestjs/common';

export const generateOTP = async (n: number) => {
  let OTP = '';
  const possible = '0123456789';
  for (let i = 0; i < n; i++) {
    OTP += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return OTP;
};

export const imageValidator = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
    return cb(new BadRequestException('Only image is allowed.'), false);
  }
  cb(null, true);
};

export const fileValidator = (req, file, cb) => {
  if (
    !file.mimetype.match(
      /\/(pdf|doc|docx|PDF|DOC|DOCX|jpg|jpeg|png|PNG|JPG|JPEG)$/,
    )
  ) {
    return cb(
      new BadRequestException('Only pdf, doc, docx is allowed.'),
      false,
    );
  }
  cb(null, true);
};
