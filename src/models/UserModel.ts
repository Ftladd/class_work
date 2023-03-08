import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user;
}

async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({
    select: { email: true, userId: true, profileViews: true, verifiedEmail: true },
    where: { userId },
  });
  return user;
}

async function getUsersByViews(minViews: number): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews', { minViews })
    .select(['user.email', 'user.profileViews', 'user.userId'])
    .getMany();

  return users;
}

async function allUserData(): Promise<User[]> {
  return await userRepository.find();
}

/* async function resetProfileViews(): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: 0 })
    .where('unverfied <> true')
    .execute();
}
*/
async function incrementProfileViews(userData: User): Promise<User> {
  const updatedUser = userData;
  updatedUser.profileViews += 1;

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ profileViews: updatedUser.profileViews })
    .where({ userId: updatedUser.userId })
    .execute();

  return updatedUser;
}

async function updateEmail(userId: string, email: string): Promise<void> {
  await userRepository.createQueryBuilder().update(User).set({ email }).where({ userId }).execute();
}

export {
  addUser,
  getUserByEmail,
  getAllUnverifiedUsers,
  getUserById,
  getUsersByViews,
  allUserData,
  incrementProfileViews,
  updateEmail,
};
