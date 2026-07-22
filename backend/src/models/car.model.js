import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    vin: {
      type: String,
      required: [true, 'VIN is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [17, 'VIN must be exactly 17 characters'],
      maxlength: [17, 'VIN must be exactly 17 characters'],
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage must be non-negative'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: {
        values: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
        message: '{VALUE} is not a valid fuel type',
      },
      default: 'Gasoline',
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: {
        values: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'],
        message: '{VALUE} is not a valid transmission type',
      },
      default: 'Automatic',
    },
    bodyType: {
      type: String,
      required: [true, 'Body type is required'],
      enum: {
        values: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Van'],
        message: '{VALUE} is not a valid body type',
      },
      default: 'Sedan',
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Sold', 'Reserved', 'In Maintenance'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
