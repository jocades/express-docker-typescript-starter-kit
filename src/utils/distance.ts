const deg2rad = (deg: number) => deg * (Math.PI / 180)

export const getDistanceInKm = <T extends number>(
  lat1: T,
  lon1: T,
  lat2: T,
  lon2: T
) => {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km

  return d
}

export const sortByDistance = (
  collection: MongoDocument[],
  lat: number,
  long: number
) => {
  const sorted = collection.sort((a, b) => {
    const distA = getDistanceInKm(lat, long, a.location.lat, a.location.long)
    const distB = getDistanceInKm(lat, long, b.location.lat, b.location.long)
    return distA - distB
  })

  return sorted
}
