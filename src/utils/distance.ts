// Haversine formula - http://www.movable-type.co.uk/scripts/latlong.html
// a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
// c = 2 ⋅ atan2( √a, √(1−a) )
// d = R ⋅ c

// where	φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
// note that angles need to be in radians to pass to trig functions!

const deg2rad = (deg: number) => deg * (Math.PI / 180)

export const getDistanceInKm = <T extends number>(lat1: T, lon1: T, lat2: T, lon2: T) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km

  return d
}

const sortByDistance = (collection: BaseModel[], lat: number, long: number) => {
  const sorted = collection.sort((a, b) => {
    const disA = getDistanceInKm(lat, long, a.location?.lat, a.location?.long)
    const disB = getDistanceInKm(lat, long, b.location.lat, b.location.long)
    return disA - disB
  })

  return sorted
}
