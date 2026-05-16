// Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function toRad(deg) { return deg * (Math.PI / 180); }

function getDeliveryDays(distanceKm) {
  if (distanceKm < 5) return 0;
  if (distanceKm < 10) return 1;
  if (distanceKm < 15) return 2;
  return 3;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Extracts lat/lng from a Google Maps URL (short or long)
async function extractCoordinates(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const finalUrl = res.url;
    
    // Regex 1: /@lat,lng/
    let match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    
    // Regex 2: /!3dlat!4dlng/
    match = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    
    // Regex 3: q=lat,lng
    match = finalUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    
    // Regex 4: ll=lat,lng
    match = finalUrl.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };

    throw new Error('Could not extract coordinates from link');
  } catch (e) {
    throw new Error('Invalid Google Maps link');
  }
}

module.exports = { calculateDistance, getDeliveryDays, addDays, extractCoordinates };
