const nodemailer = require('nodemailer');
const fs = require('fs');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO;

const PDF_PATH = './floor_check_log.pdf';

if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
  console.error('Please set EMAIL_USER, EMAIL_PASS, and EMAIL_TO as secrets in GitHub!');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change to outlook, yahoo, etc.
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const mailOptions = {
  from: EMAIL_USER,
  to: EMAIL_TO,
  subject: 'Daily Floor Check Log PDF',
  text: 'Attached is the daily floor check log.',
  attachments: [
    {
      filename: 'floor_check_log.pdf',
      path: PDF_PATH
    }
  ]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
