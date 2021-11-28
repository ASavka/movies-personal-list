import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync('./src/private.key');
const publicKey = fs.readFileSync('./src/public.key');

const headers = {
  issuer: 'Lohika',
  algorithm: 'RS256',
};

interface IData {
  name: string;
  role: string;
}

interface IToken {
  payload: IData;
}

const encrypt = (data: IData): string => {
  return jwt.sign({ payload: data }, privateKey, headers as jwt.SignOptions);
};

const decrypt = (token: string) => {
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as IToken;
};

export { encrypt, decrypt };
