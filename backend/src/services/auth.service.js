const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repositories/user.repository');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  constructor(userRepo = userRepository) {
    this.userRepo = userRepo;
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hashed) {
    return bcrypt.compare(password, hashed);
  }

  generateToken(userId, role) {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign({ id: userId, role }, secret, { expiresIn });
  }

  async register(data) {
    if (!data.name || !data.email || !data.password) {
      throw new AppError('Please provide name, email, and password', 400);
    }

    if (data.password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await this.hashPassword(data.password);
    const user = await this.userRepo.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'user',
    });

    const userIdStr = String(user._id);
    const token = this.generateToken(userIdStr, user.role);

    return {
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(data) {
    if (!data.email || !data.password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await this.comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const userIdStr = String(user._id);
    const token = this.generateToken(userIdStr, user.role);

    return {
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getCurrentUser(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

const authService = new AuthService();

module.exports = {
  AuthService,
  authService,
};
