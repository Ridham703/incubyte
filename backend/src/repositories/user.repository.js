const { User } = require('../models/user.model');

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id) {
    return User.findById(id).select('-password').exec();
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }
}

const userRepository = new UserRepository();

module.exports = {
  UserRepository,
  userRepository,
};
