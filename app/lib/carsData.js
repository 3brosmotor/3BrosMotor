// 3BrosMotor Dealership Inventory 
// Production-Ready: Starts clean with 0 mock vehicles. Real fleet is entered via Admin Portal.

export const INITIAL_60_VEHICLES = [];

export function getVehicleImages(car) {
  if (!car) return [];

  // 1. Direct explicit gallery images
  if (Array.isArray(car.images) && car.images.length > 0) {
    const validImages = car.images.filter(img => typeof img === 'string' && img.trim().length > 0);
    if (validImages.length > 0) {
      return validImages;
    }
  }

  // 2. Base photo
  const primary = car.photo;
  if (primary && typeof primary === 'string' && primary.trim().length > 0) {
    return [primary.trim()];
  }

  return [];
}
