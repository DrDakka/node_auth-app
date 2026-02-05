import usr from './user.service.ts';
import tkn from './token.service.ts';
import emailService from './email.service.ts';

const srv = {
  usr: usr,
  tkn: tkn,
  email: emailService,
};

export default srv;
