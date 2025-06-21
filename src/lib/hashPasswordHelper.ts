import crypto from 'crypto';

export default function generateHash(
  password: string,
  salt: string,
): Promise<Error | string> {
  return new Promise((res, rej) => {
    crypto.pbkdf2(
      password.normalize(),
      salt,
      100000,
      64,
      'sha512',
      (err, hash) => {
        if (err) rej(err);
        else res(hash.toString('hex').normalize());
      },
    );
  });
}

export function generateSalt(): Promise<string | Error> {
  return new Promise((res, rej) => {
    crypto.randomBytes(16, (err, buff) => {
      if (err) rej(err);
      else res(buff.toString('hex').normalize());
    });
  });
}

export async function verifyHash(
  inputPassword: string,
  storedHash: string,
  salt: string,
): Promise<boolean> {
  const newHash = await generateHash(inputPassword, salt);

  return new Promise((res, rej) => {
    if (newHash instanceof Error) {
      console.log(newHash);
      return rej(false);
    } else {
      res(
        crypto.timingSafeEqual(
          Buffer.from(storedHash, 'hex'),
          Buffer.from(newHash, 'hex'),
        ),
      );
    }
  });
}
