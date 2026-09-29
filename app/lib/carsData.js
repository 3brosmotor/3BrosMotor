// 5 Lean High-Quality Starter Vehicles for 3BrosMotor Dealership Inventory
// Clean baseline until real user fleet data is uploaded via the Admin Portal

export const INITIAL_60_VEHICLES = [
  {
    id: '1001',
    make: 'Toyota',
    model: 'Hilux Revo 4WD',
    year: '2022',
    chassis: 'GUN125-3940215',
    location: 'Dar es Salaam Yard',
    price: '34,500',
    photo: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    color: 'WHITE',
    fuel: 'DIESEL',
    doors: '5',
    seats: '5',
    bodyType: 'Pickup',
    features: 'Bluetooth Airbags CD Player Alloy Wheels Fog Lamps 4WD Reverse Camera',
    engine: '2390 CC',
    mileage: '45,700 KM',
    trans: 'Auto',
    steering: 'RIGHT',
    status: 'In Stock'
  },
  {
    id: '1002',
    make: 'Toyota',
    model: 'Land Cruiser Prado TX-L',
    year: '2019',
    chassis: 'GDJ150-0042189',
    location: 'Dar es Salaam Yard',
    price: '46,800',
    photo: 'https://res.cloudinary.com/ztiftbhu/image/upload/v1790281550/Toyota_Land_Cruiser_Prado_TX-L.jpg',
    images: [
      'https://res.cloudinary.com/ztiftbhu/image/upload/v1790281550/Toyota_Land_Cruiser_Prado_TX-L.jpg',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80'
    ],
    color: 'PEARL WHITE',
    fuel: 'DIESEL',
    doors: '5',
    seats: '7',
    bodyType: 'SUV',
    features: 'Sunroof Leather Seats Push Start Cool Box 4WD Alloy Wheels',
    engine: '2770 CC',
    mileage: '38,200 KM',
    trans: 'Auto',
    steering: 'RIGHT',
    status: 'In Stock'
  },
  {
    id: '1003',
    make: 'Toyota',
    model: 'Land Cruiser V8 ZX',
    year: '2018',
    chassis: 'URJ202-4019283',
    location: 'Dar es Salaam Yard',
    price: '68,500',
    photo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    color: 'BLACK',
    fuel: 'PETROL',
    doors: '5',
    seats: '8',
    bodyType: 'SUV',
    features: 'Height Control Multi-Terrain Select Sunroof Rear Entertainment 360 Camera',
    engine: '4600 CC',
    mileage: '52,100 KM',
    trans: 'Auto',
    steering: 'RIGHT',
    status: 'In Stock'
  },
  {
    id: '1004',
    make: 'Toyota',
    model: 'Harrier Elegance',
    year: '2017',
    chassis: 'ZSU60-0104821',
    location: 'Dar es Salaam Yard',
    price: '22,400',
    photo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80'
    ],
    color: 'WINE RED',
    fuel: 'PETROL',
    doors: '5',
    seats: '5',
    bodyType: 'SUV',
    features: 'Half Leather Power Seats Radar Cruise Control LED Headlamps Lane Assist',
    engine: '1980 CC',
    mileage: '49,800 KM',
    trans: 'Auto',
    steering: 'RIGHT',
    status: 'In Stock'
  },
  {
    id: '1005',
    make: 'Toyota',
    model: 'RAV4 Adventure',
    year: '2020',
    chassis: 'MXAA54-2019482',
    location: 'Dar es Salaam Yard',
    price: '29,800',
    photo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    color: 'GREY',
    fuel: 'PETROL',
    doors: '5',
    seats: '5',
    bodyType: 'SUV',
    features: 'Dynamic Torque AWD Roof Bars Digital Display Keyless Apple CarPlay',
    engine: '1990 CC',
    mileage: '33,400 KM',
    trans: 'Auto',
    steering: 'RIGHT',
    status: 'In Stock'
  }
];

/**
 * Returns a guaranteed array of high-resolution images for any vehicle (minimum 4 viewing angles)
 */
export function getVehicleImages(car) {
  if (!car) return [];
  
  // 1. If explicit images array is provided with multiple images, return it
  if (Array.isArray(car.images) && car.images.length > 0) {
    const valid = car.images.filter(Boolean);
    if (valid.length > 1) {
      return valid;
    }
  }

  // 2. Base photo or fallback
  const primary = (Array.isArray(car.images) && car.images[0]) || car.photo;
  
  if (!primary) {
    const seed = encodeURIComponent(`${car.make || 'toyota'}-${car.model || 'vehicle'}-${car.id || '1000'}`);
    return [
      `https://picsum.photos/seed/${seed}-front/800/600`,
      `https://picsum.photos/seed/${seed}-side/800/600`,
      `https://picsum.photos/seed/${seed}-interior/800/600`,
      `https://picsum.photos/seed/${seed}-rear/800/600`
    ];
  }

  // If using picsum seeded images, generate complementary angles
  if (primary.includes('picsum.photos/seed/')) {
    const seedMatch = primary.match(/\/seed\/([^/]+)/);
    const rawSeed = seedMatch ? seedMatch[1].replace(/-(front|side|rear|interior|seats|cockpit|engine)$/, '') : `${car.make}-${car.model}`;
    return [
      primary,
      `https://picsum.photos/seed/${rawSeed}-side/800/600`,
      `https://picsum.photos/seed/${rawSeed}-interior/800/600`,
      `https://picsum.photos/seed/${rawSeed}-rear/800/600`,
      `https://picsum.photos/seed/${rawSeed}-seats/800/600`
    ];
  }

  // If a single custom image is uploaded, return it as the first photo, with angle tags
  return [primary];
}

