import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addUser } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as NewUserRequest;

  // Hash user's password
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(email, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as NewUserRequest;
  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const { passwordHash } = addUser;

  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(200);
}

export { registerUser, logIn };
