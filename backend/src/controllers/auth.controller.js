const { authService } = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return next(new Error('User context missing'));
      }
      const user = await authService.getCurrentUser(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

module.exports = {
  AuthController,
  authController,
};
