import { User, IUser } from '../models/user.model';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password').exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }
}

export const userRepository = new UserRepository();
