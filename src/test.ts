import DB from './model/index.ts';
import { TNAMES } from './static/index.ts';
import bcrypt from 'bcrypt';

async function getTestUsr() {
  const createUsr = async (usr: {
    name: string;
    email: string;
    password: string;
    activated: boolean;
  }) => {
    await DB[TNAMES.USR].create({
      ...usr,
    });
  };

  const pwds = ['jdfu70sdf', 'jdddu70sdf', 'jdgfdfd70sdf'];
  const testUsrs = [
    {
      name: 'JohnDoe',
      email: 'gtlafuk@iksf.fsd',
      password: await bcrypt.hash(pwds[0], 10),
      activated: true,
    },
    {
      name: 'Yurgen',
      email: 'gtlasdk@iksf.fsd',
      password: await bcrypt.hash(pwds[1], 10),
      activated: true,
    },
    {
      name: 'JosdnDoe',
      email: 'gtsdgasfuk@iksf.fsd',
      password: await bcrypt.hash(pwds[2], 10),
      activated: true,
    },
  ];

  await testUsrs.map((el) => createUsr(el));
}

export default getTestUsr;
