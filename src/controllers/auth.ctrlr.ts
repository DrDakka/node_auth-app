import http from 'http';
import bcrypt from 'bcrypt';
import { RequestError } from '../errors';
import { tknServices, usrServices } from '../services';
import { httpStatus, TNAMES, fnames, TKN } from '../static';
import sch from '../validation/schemas';
import { createAccessToken } from '../utils/jwt';

const auth = async (res: http.ServerResponse, body: typeof sch.auth) => {
  const { email, password } = body;
  const nms = fnames[TNAMES.USR];

  const usr = await usrServices.getByEmail(email);

  if (!usr) {
    throw new RequestError(`User with email ${email} not found`, httpStatus.nf);
  }

  const isValid = await bcrypt.compare(password, usr.password);

  if (!isValid) {
    throw new RequestError(`Wrong password`, httpStatus.na);
  }
  const { id, name } = usr;

  const payload = { id, name, email };

  const token = await createAccessToken(payload);
  const ref = await createAccessToken(payload);

  tknServices.create(id, ref.token, TKN.RFR, ref.expiry);

  
   // setCors();
};
