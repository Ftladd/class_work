import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import ip from 'ip';
import { registerUser, logIn, getAllUsers } from './controllers/UserController';

const app: Express = express();
app.use(express.json());

const { PORT } = process.env;

app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.get('/api/users', getAllUsers);

app.listen(PORT, () => {
  console.log(`Listening at http://${ip.address()}:${PORT}`);
});
