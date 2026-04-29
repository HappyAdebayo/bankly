'use strict';

const nodemailer = require('nodemailer');

/**
 * sendEmail({ to, from, subject, html, provider })
 * All values should be fully resolved before calling this function.
 */
exports.sendEmail = async ({ to, from, subject, html, provider = 'smtp' }) => {
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }
  try {
    if (provider === 'smtp') {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: from,
        to,
        subject,
        html,
      });
    } else if (provider === 'sendgrid') {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({ to, from: from || process.env.SENDGRID_FROM, subject, html });
    } else if (provider === 'mailgun') {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
      await mg.messages.create(process.env.MAILGUN_DOMAIN, { 
        from: from || process.env.MAILGUN_FROM, 
        to: [to], 
        subject, 
        html 
      });
    } else if (provider === 'ses') {
      const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
      const ses = new SESClient({ region: process.env.AWS_REGION });
      await ses.send(new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: { Body: { Html: { Data: html } }, Subject: { Data: subject } },
        Source: from || process.env.AWS_SES_FROM
      }));
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
