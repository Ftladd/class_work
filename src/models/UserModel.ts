import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);
async function addUser(email: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  newUser = await userRepository.save(newUser);
  return newUser;
}
export { addUser };
