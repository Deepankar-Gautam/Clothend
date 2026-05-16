const clothesData = [
  // T-Shirts (3-6/day)
  { id: "t1", name: "Classic White Tee", type: "T-Shirts", color: "White", gender: "Male", size: "L", price: 4, image: "https://source.unsplash.com/300x400/?white-tshirt" },
  { id: "t2", name: "Graphic Print Tee", type: "T-Shirts", color: "Black", gender: "Female", size: "M", price: 5, image: "https://source.unsplash.com/300x400/?graphic-tshirt" },
  { id: "t3", name: "V-Neck Basic", type: "T-Shirts", color: "Grey", gender: "Male", size: "M", price: 3, image: "https://source.unsplash.com/300x400/?vneck-tshirt" },
  { id: "t4", name: "Oversized Cotton Tee", type: "T-Shirts", color: "Blue", gender: "Female", size: "L", price: 6, image: "https://source.unsplash.com/300x400/?blue-tshirt" },
  { id: "t5", name: "Striped Summer Tee", type: "T-Shirts", color: "Red/White", gender: "Female", size: "S", price: 4, image: "https://source.unsplash.com/300x400/?striped-tshirt" },
  { id: "t6", name: "Polo T-Shirt", type: "T-Shirts", color: "Navy", gender: "Male", size: "XL", price: 6, image: "https://source.unsplash.com/300x400/?polo-shirt" },

  // Hoodies (8-12/day)
  { id: "h1", name: "Essential Black Hoodie", type: "Hoodies", color: "Black", gender: "Male", size: "L", price: 10, image: "https://source.unsplash.com/300x400/?black-hoodie" },
  { id: "h2", name: "Crop Pastel Hoodie", type: "Hoodies", color: "Pink", gender: "Female", size: "S", price: 9, image: "https://source.unsplash.com/300x400/?pink-hoodie" },
  { id: "h3", name: "Zip-Up Fleece Hoodie", type: "Hoodies", color: "Grey", gender: "Male", size: "M", price: 8, image: "https://source.unsplash.com/300x400/?grey-hoodie" },
  { id: "h4", name: "Oversized Streetwear Hoodie", type: "Hoodies", color: "Olive", gender: "Female", size: "M", price: 11, image: "https://source.unsplash.com/300x400/?green-hoodie" },
  { id: "h5", name: "Graphic Printed Hoodie", type: "Hoodies", color: "White", gender: "Male", size: "XL", price: 12, image: "https://source.unsplash.com/300x400/?white-hoodie" },

  // Jeans (5-10/day)
  { id: "j1", name: "Classic Blue Denim", type: "Jeans", color: "Blue", gender: "Male", size: "32", price: 7, image: "https://source.unsplash.com/300x400/?blue-jeans" },
  { id: "j2", name: "High-Waist Skinny Jeans", type: "Jeans", color: "Black", gender: "Female", size: "28", price: 8, image: "https://source.unsplash.com/300x400/?black-jeans" },
  { id: "j3", name: "Ripped Mom Jeans", type: "Jeans", color: "Light Blue", gender: "Female", size: "30", price: 9, image: "https://source.unsplash.com/300x400/?ripped-jeans" },
  { id: "j4", name: "Straight Fit Denim", type: "Jeans", color: "Dark Wash", gender: "Male", size: "34", price: 7, image: "https://source.unsplash.com/300x400/?dark-jeans" },
  { id: "j5", name: "Flared Vintage Jeans", type: "Jeans", color: "Blue", gender: "Female", size: "29", price: 10, image: "https://source.unsplash.com/300x400/?flared-jeans" },
  { id: "j6", name: "Cargo Denim", type: "Jeans", color: "Grey", gender: "Male", size: "32", price: 8, image: "https://source.unsplash.com/300x400/?cargo-jeans" },

  // Shirts (5-9/day)
  { id: "s1", name: "Formal White Shirt", type: "Shirts", color: "White", gender: "Male", size: "M", price: 6, image: "https://source.unsplash.com/300x400/?white-shirt" },
  { id: "s2", name: "Casual Checkered Shirt", type: "Shirts", color: "Red/Black", gender: "Male", size: "L", price: 5, image: "https://source.unsplash.com/300x400/?flannel-shirt" },
  { id: "s3", name: "Silk Blouse", type: "Shirts", color: "Beige", gender: "Female", size: "S", price: 8, image: "https://source.unsplash.com/300x400/?silk-blouse" },
  { id: "s4", name: "Denim Button-Down", type: "Shirts", color: "Blue", gender: "Male", size: "M", price: 7, image: "https://source.unsplash.com/300x400/?denim-shirt" },
  { id: "s5", name: "Floral Print Shirt", type: "Shirts", color: "Multicolor", gender: "Female", size: "M", price: 6, image: "https://source.unsplash.com/300x400/?floral-shirt" },
  { id: "s6", name: "Linen Summer Shirt", type: "Shirts", color: "Light Blue", gender: "Male", size: "L", price: 9, image: "https://source.unsplash.com/300x400/?linen-shirt" },

  // Blazers (12-20/day)
  { id: "b1", name: "Navy Blue Suit Blazer", type: "Blazers", color: "Navy", gender: "Male", size: "40", price: 15, image: "https://source.unsplash.com/300x400/?navy-blazer" },
  { id: "b2", name: "Tailored Office Blazer", type: "Blazers", color: "Grey", gender: "Female", size: "M", price: 14, image: "https://source.unsplash.com/300x400/?grey-blazer" },
  { id: "b3", name: "Casual Corduroy Blazer", type: "Blazers", color: "Brown", gender: "Male", size: "42", price: 13, image: "https://source.unsplash.com/300x400/?corduroy-blazer" },
  { id: "b4", name: "Double Breasted Blazer", type: "Blazers", color: "Black", gender: "Female", size: "S", price: 16, image: "https://source.unsplash.com/300x400/?black-blazer" },
  { id: "b5", name: "Velvet Evening Blazer", type: "Blazers", color: "Maroon", gender: "Male", size: "38", price: 18, image: "https://source.unsplash.com/300x400/?velvet-blazer" },
  { id: "b6", name: "Linen Blend Blazer", type: "Blazers", color: "Beige", gender: "Female", size: "L", price: 12, image: "https://source.unsplash.com/300x400/?linen-blazer" },

  // Jackets (8-15/day)
  { id: "jk1", name: "Classic Leather Jacket", type: "Jackets", color: "Black", gender: "Male", size: "L", price: 15, image: "https://source.unsplash.com/300x400/?leather-jacket" },
  { id: "jk2", name: "Denim Trucker Jacket", type: "Jackets", color: "Blue", gender: "Female", size: "M", price: 9, image: "https://source.unsplash.com/300x400/?denim-jacket" },
  { id: "jk3", name: "Puffer Winter Jacket", type: "Jackets", color: "Olive", gender: "Male", size: "XL", price: 12, image: "https://source.unsplash.com/300x400/?puffer-jacket" },
  { id: "jk4", name: "Cropped Biker Jacket", type: "Jackets", color: "Brown", gender: "Female", size: "S", price: 14, image: "https://source.unsplash.com/300x400/?biker-jacket" },
  { id: "jk5", name: "Bomber Jacket", type: "Jackets", color: "Navy", gender: "Male", size: "M", price: 10, image: "https://source.unsplash.com/300x400/?bomber-jacket" },

  // Ethnic Wear (15-25/day)
  { id: "e1", name: "Embroidered Kurta Set", type: "Ethnic Wear", color: "Yellow", gender: "Male", size: "L", price: 15, image: "https://source.unsplash.com/300x400/?kurta" },
  { id: "e2", name: "Designer Silk Lehenga", type: "Ethnic Wear", color: "Red", gender: "Female", size: "M", price: 25, image: "https://source.unsplash.com/300x400/?lehenga" },
  { id: "e3", name: "Festive Sherwani", type: "Ethnic Wear", color: "Cream", gender: "Male", size: "40", price: 22, image: "https://source.unsplash.com/300x400/?sherwani" },
  { id: "e4", name: "Georgette Saree", type: "Ethnic Wear", color: "Blue", gender: "Female", size: "Free", price: 18, image: "https://source.unsplash.com/300x400/?saree" },
  { id: "e5", name: "Cotton Nehru Jacket", type: "Ethnic Wear", color: "Green", gender: "Male", size: "M", price: 10, image: "https://source.unsplash.com/300x400/?nehru-jacket" },
  { id: "e6", name: "Anarkali Suit", type: "Ethnic Wear", color: "Pink", gender: "Female", size: "L", price: 20, image: "https://source.unsplash.com/300x400/?anarkali" },

  // Casual Wear (4-8/day)
  { id: "c1", name: "Summer Midi Dress", type: "Casual Wear", color: "Floral", gender: "Female", size: "M", price: 8, image: "https://source.unsplash.com/300x400/?midi-dress" },
  { id: "c2", name: "Chino Shorts", type: "Casual Wear", color: "Khaki", gender: "Male", size: "32", price: 5, image: "https://source.unsplash.com/300x400/?chino-shorts" },
  { id: "c3", name: "Jumpsuit Romper", type: "Casual Wear", color: "Olive", gender: "Female", size: "S", price: 7, image: "https://source.unsplash.com/300x400/?jumpsuit" },
  { id: "c4", name: "Cargo Pants", type: "Casual Wear", color: "Black", gender: "Male", size: "34", price: 6, image: "https://source.unsplash.com/300x400/?cargo-pants" },
  { id: "c5", name: "Pleated Skirt", type: "Casual Wear", color: "White", gender: "Female", size: "M", price: 6, image: "https://source.unsplash.com/300x400/?pleated-skirt" }
];

export default clothesData;
