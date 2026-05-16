const mongoose = require('mongoose');
require('dotenv').config();
const Cloth = require('./models/Cloth');

// We use real Google Maps links for seeded items
const locationUrls = [
  "https://maps.app.goo.gl/1wZf2wX1d3QpXQc29", // example link 1
  "https://maps.app.goo.gl/34A1y2rE4A9K8xG57", // example link 2 (might be invalid but serves for UI)
  "https://www.google.com/maps/place/Connaught+Place,+New+Delhi,+Delhi/@28.6314512,77.2166672,15z",
  "https://www.google.com/maps/place/Saket,+New+Delhi,+Delhi/@28.5244281,77.2066127,15z",
  "https://www.google.com/maps/place/Sector+18,+Noida,+Uttar+Pradesh/@28.5706336,77.3212136,15z",
  "https://www.google.com/maps/place/Dwarka,+New+Delhi,+Delhi/@28.5921401,77.0460481,13z",
  "https://www.google.com/maps/place/DLF+Cyber+City,+DLF+Phase+2,+Sector+24,+Gurugram,+Haryana/@28.4942,77.0887,15z",
  "https://www.google.com/maps/place/Lajpat+Nagar,+New+Delhi,+Delhi/@28.5677,77.2433,15z",
  "https://www.google.com/maps/place/Rohini,+New+Delhi,+Delhi/@28.7325,77.1148,13z",
  "https://www.google.com/maps/place/Greater+Noida,+Uttar+Pradesh/@28.4744,77.5040,12z"
];

const raw = [
  ["Classic Black Tee", "T-Shirts", "Black", "Male", "M", 5],
  ["White Crew Neck", "T-Shirts", "White", "Male", "L", 4],
  ["Navy Stripe Tee", "T-Shirts", "Blue", "Male", "S", 4],
  ["Red Graphic Tee", "T-Shirts", "Red", "Female", "M", 5],
  ["Grey Basic Tee", "T-Shirts", "Grey", "Female", "S", 3],
  ["Yellow Summer Tee", "T-Shirts", "Yellow", "Female", "L", 5],
  ["Pullover Hoodie", "Hoodies", "Black", "Male", "L", 8],
  ["Zip-Up Hoodie", "Hoodies", "Grey", "Male", "M", 7],
  ["Crop Hoodie", "Hoodies", "Pink", "Female", "S", 8],
  ["Fleece Hoodie", "Hoodies", "Brown", "Male", "XL", 9],
  ["Pastel Hoodie", "Hoodies", "Purple", "Female", "M", 7],
  ["Oversized Hoodie", "Hoodies", "White", "Female", "L", 8],
  ["Slim Fit Jeans", "Jeans", "Blue", "Male", "M", 6],
  ["Baggy Jeans", "Jeans", "Blue", "Male", "L", 6],
  ["Ripped Jeans", "Jeans", "Black", "Female", "S", 7],
  ["Mom Jeans", "Jeans", "Blue", "Female", "M", 6],
  ["Straight Jeans", "Jeans", "Grey", "Male", "L", 6],
  ["Formal White Shirt", "Shirts", "White", "Male", "M", 6],
  ["Denim Shirt", "Shirts", "Blue", "Male", "L", 7],
  ["Linen Shirt", "Shirts", "White", "Male", "M", 8],
  ["Flannel Shirt", "Shirts", "Red", "Male", "S", 6],
  ["Silk Blouse", "Shirts", "Pink", "Female", "S", 9],
  ["Office Blazer", "Blazers", "Black", "Male", "L", 12],
  ["Casual Blazer", "Blazers", "Brown", "Male", "M", 10],
  ["Women Blazer", "Blazers", "Black", "Female", "S", 11],
  ["Summer Blazer", "Blazers", "White", "Female", "M", 10],
  ["Velvet Blazer", "Blazers", "Purple", "Male", "L", 14],
  ["Leather Jacket", "Jackets", "Black", "Male", "L", 15],
  ["Denim Jacket", "Jackets", "Blue", "Female", "M", 10],
  ["Bomber Jacket", "Jackets", "Green", "Male", "M", 9],
  ["Puffer Jacket", "Jackets", "Black", "Female", "M", 12],
  ["Rain Jacket", "Jackets", "Yellow", "Male", "L", 7],
  ["Cotton Kurta", "Ethnic Wear", "White", "Male", "M", 8],
  ["Silk Kurta Set", "Ethnic Wear", "Red", "Male", "L", 12],
  ["Anarkali Suit", "Ethnic Wear", "Pink", "Female", "M", 15],
  ["Lehenga Choli", "Ethnic Wear", "Red", "Female", "S", 20],
  ["Sherwani", "Ethnic Wear", "White", "Male", "L", 18],
  ["Palazzo Kurta", "Ethnic Wear", "Yellow", "Female", "M", 10],
  ["Cargo Pants", "Casual Wear", "Green", "Male", "M", 6],
  ["Track Pants", "Casual Wear", "Black", "Male", "L", 5],
  ["Joggers", "Casual Wear", "Grey", "Female", "M", 5],
  ["Summer Dress", "Casual Wear", "Pink", "Female", "M", 9],
  ["Maxi Dress", "Casual Wear", "White", "Female", "L", 10],
  ["Sweatshirt", "Casual Wear", "Purple", "Male", "M", 7],
  ["Cardigan", "Casual Wear", "Brown", "Female", "M", 8],
];

const clothes = raw.map(function (item, i) {
  return {
    name: item[0], type: item[1], color: item[2], gender: item[3], size: item[4], price: item[5],
    image: "https://picsum.photos/seed/cloth" + (i + 1) + "/300/400",
    locationUrl: locationUrls[i % locationUrls.length],
    available: true,
    availableDate: null
  };
});

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Cloth.deleteMany({});
    await Cloth.insertMany(clothes);
    console.log('Seeded ' + clothes.length + ' clothes with location URLs!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
