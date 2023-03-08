import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  allUserData,
  getUserById,
  incrementProfileViews,
  updateEmail,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;
  console.log(req.body);

  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
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
  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  console.log(req.body);

  // Check if the user account exists for that email
  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The account exists so now we can check their password
  const { passwordHash } = user;

  // If the password does not match
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The user has successfully logged in
  // NOTES: We will update this once we implement session management
  res.sendStatus(200); // 200 OK
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();

  res.json(users);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;

  let user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  user = await incrementProfileViews(user);

  res.json(user);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { newEmail } = req.body as { newEmail: string };
  const { userId } = req.params as UserIdParam;

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  try {
    await updateEmail(userId, newEmail);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }

  res.json(user);
}

export { registerUser, logIn, getAllUsers, getUserProfileData, updateUserEmail };
