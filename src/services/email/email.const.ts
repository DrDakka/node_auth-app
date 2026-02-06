import { ep } from '../../static/index.ts';

const mailTemplate = {
  act: 'activation',
  res: 'pwd reset',
} as const;

const activate = (token: string) => {
  const link = `${process.env.BASE_URL}${ep.act}?token=${token}`;

  return {
    subject: 'Account activation',
    html: `
      <h1>Hello!</h1>
      <p>Click the link below to activate your account:</p>
      <a href="${link}">${link}</a>
    `,
  };
};

const reset = (token: string) => {
  const link = `${process.env.BASE_URL}${ep.pwrc}?token=${token}`;

  return {
    subject: 'Password reset',
    html: `
      <h1>Hello!</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
    `,
  };
};

const getTemplate = {
  [mailTemplate.act]: activate,
  [mailTemplate.res]: reset,
};

export { mailTemplate, getTemplate };
