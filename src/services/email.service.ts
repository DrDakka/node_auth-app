import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

async function sendMail(options: MailOptions): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@example.com',
    ...options,
  });
}

async function sendActivationEmail(
  email: string,
  token: string,
): Promise<void> {
  const link = `${process.env.BASE_URL}/activate?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Account activation',
    html: `
      <h1>Hello!</h1>
      <p>Click the link below to activate your account:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

async function sendPwdRes(email: string, token: string): Promise<void> {
  const link = `${process.env.BASE_URL}/password/reset?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Password reset',
    html: `
      <h1>Hello!</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

const emailService = {
  send: sendMail,
  sendActivation: sendActivationEmail,
  sendReset: sendPwdRes,
};

export default emailService;
