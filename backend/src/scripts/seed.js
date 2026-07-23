const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const { User } = require('../models/user.model');
const { Vehicle } = require('../models/vehicle.model');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    const connected = await connectDB();
    if (!connected) {
      console.error('Database connection failed. Aborting seed script.');
      process.exit(1);
    }

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});

    console.log('Creating default user and admin accounts...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Ridham@123', salt);
    const userPassword = await bcrypt.hash('Ridham@123', salt);

    await User.create([
      {
        name: 'System Administrator',
        email: 'ridhammangroliya4080@gmail.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'ridhammangroliya@gmail.com',
        password: userPassword,
        role: 'admin',
      },
    ]);

    console.log('Creating sample vehicle inventory...');
    const vehicles = [
      {
        make: 'Tesla',
        model: 'Model S Plaid',
        year: 2024,
        price: 89990,
        mileage: 1200,
        fuelType: 'Electric',
        transmission: 'Automatic',
        stock: 5,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
        description: 'Tri-Motor All-Wheel Drive with 1,020 hp. 0-60 mph in 1.99s. Full Self-Driving capability package included.',
      },
      {
        make: 'Porsche',
        model: '911 GT3 RS',
        year: 2023,
        price: 241300,
        mileage: 850,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 2,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000',
        description: '4.0L naturally aspirated flat-six producing 518 hp. Lightweight construction with extreme aerodynamic downforce.',
      },
      {
        make: 'BMW',
        model: 'M4 Competition xDrive',
        year: 2024,
        price: 86300,
        mileage: 3400,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 4,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000',
        description: '3.0L BMW M TwinPower Turbo inline 6-cylinder engine delivering 503 hp. Carbon fiber bucket seats and M Driver Package.',
      },
      {
        make: 'Audi',
        model: 'RS e-tron GT',
        year: 2024,
        price: 106500,
        mileage: 2100,
        fuelType: 'Electric',
        transmission: 'Automatic',
        stock: 3,
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=1000',
        description: 'Dual electric motors with electric quattro all-wheel drive, generating up to 637 hp in boost mode.',
      },
      {
        make: 'Ford',
        model: 'Mustang Mach-E GT',
        year: 2023,
        price: 59995,
        mileage: 8900,
        fuelType: 'Electric',
        transmission: 'Automatic',
        stock: 6,
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=1000',
        description: 'High-Performance electric SUV with MagneRide Damping System and Ford BlueCruise hands-free highway driving.',
      },
      {
        make: 'Mercedes-Benz',
        model: 'AMG GT 63 S',
        year: 2023,
        price: 170000,
        mileage: 5200,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 1,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000',
        description: 'Handcrafted AMG 4.0L V8 biturbo engine putting out 630 hp with AMG Performance 4MATIC+ all-wheel drive.',
      },
      {
        make: 'Toyota',
        model: 'RAV4 Prime Plug-in',
        year: 2024,
        price: 44425,
        mileage: 450,
        fuelType: 'Plug-in Hybrid',
        transmission: 'CVT',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1000',
        description: 'Plug-in hybrid electric vehicle with 302 combined net horsepower and up to 42 miles of EV mode driving range.',
      },
      {
        make: 'Chevrolet',
        model: 'Corvette Z06 3LZ',
        year: 2023,
        price: 135000,
        mileage: 1800,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 2,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000',
        description: 'Flat-plane crank 5.5L LT6 V8 engine producing 670 hp, high-revving up to 8,600 RPM.',
      },
    ];

    await Vehicle.insertMany(vehicles);

    console.log('Successfully seeded database!');
    console.log('----------------------------------------------------');
    console.log('Default Accounts Created:');
    console.log('  Admin: email: admin@dealership.com | password: Admin123!');
    console.log('  User:  email: user@dealership.com  | password: User123!');
    console.log(`Vehicles Inserted: ${vehicles.length} items`);
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
