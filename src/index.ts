import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import ip from 'ip';
import connectSqlite3 from 'connect-sqlite3';
import {
  registerUser,
  logIn,
  getAllUsers,
  getUserProfileData,
  updateUserEmail,
} from './controllers/UserController';
import { addNewBook } from './controllers/BookController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.slqite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());

app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.get('/api/users', getAllUsers);
app.get('/api/users/:userId', getUserProfileData);
app.post('/api/users/:userId/email', updateUserEmail);

app.post('/api/books', addNewBook);

app.listen(PORT, () => {
  console.log(`Listening at http://${ip.address()}:${PORT}`);
});
