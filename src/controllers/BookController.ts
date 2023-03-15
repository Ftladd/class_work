import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { addBook, getAllBooks } from '../models/BookModel';

type NewBookRequest = {
  title: string;
  publicationYear: number;
};

async function addNewBook(req: Request, res: Response): Promise<void> {
  const { title, publicationYear } = req.body as NewBookRequest;

  try {
    const newBook = await addBook(title, publicationYear);
    console.log(newBook);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getBooks(req: Request, res: Response): Promise<void> {
  const users = await getAllBooks();

  res.json(users);
}

export { addNewBook, getBooks };
