const { Schema, model } = require('mongoose');

const currentYear = new Date().getFullYear();

const vehicleSchema = new Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Year must be at or after 1900'],
      max: [currentYear + 1, `Year cannot exceed ${currentYear + 1}`],
    },
    price: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mileage: {
      type: Number,
      required: [true, 'Vehicle mileage is required'],
      min: [0, 'Mileage cannot be negative'],
    },
    fuelType: {
      type: String,
      required: [true, 'Vehicle fuel type is required'],
      enum: {
        values: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
        message: '{VALUE} is not a valid fuel type',
      },
    },
    transmission: {
      type: String,
      required: [true, 'Vehicle transmission is required'],
      enum: {
        values: ['Automatic', 'Manual', 'CVT'],
        message: '{VALUE} is not a valid transmission type',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = model('Vehicle', vehicleSchema);

module.exports = {
  Vehicle,
};
