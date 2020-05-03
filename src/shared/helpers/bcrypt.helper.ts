import { hash, genSalt } from 'bcryptjs';

export const getHashedPassword = (password: string, salt: string): Promise<string> => hash(password, salt);
export const getSalt = () => genSalt();

export const comparePasswords = async (password: string, salt: string, hashedPassword: string): Promise<boolean> =>
  password ? (await getHashedPassword(password, salt)) === hashedPassword : false;
