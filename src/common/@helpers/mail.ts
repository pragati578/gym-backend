import { createTransport, SendMailOptions, TransportOptions } from 'nodemailer';
import { SMTP } from 'src/constant';

const transporter = createTransport({
  host: SMTP.HOST,
  port: SMTP.PORT,
  secure: SMTP.SECURE,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASS,
  },
} as TransportOptions);

const sendMail = async (options: SendMailOptions) => {
  try {
    options.from = {
      name: 'Gym Management System',
      address: SMTP.USER as string,
    };
    const result = await transporter.sendMail(options);
    console.log('SEND MAIL RESULT: ', result);
  } catch (err) {
    console.log('SEND MAIL ERROR: ', err);
  }
};

export { sendMail };
