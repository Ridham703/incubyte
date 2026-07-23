class HealthController {
  getHealth(_req, res) {
    res.status(200).json({
      status: 'UP',
      message: 'Car Dealership Inventory API is running',
      timestamp: new Date().toISOString(),
    });
  }
}

const healthController = new HealthController();

module.exports = {
  HealthController,
  healthController,
};
