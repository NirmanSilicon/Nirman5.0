// Convert city or pincode into coordinates using Nominatim (free OSM geocoding)
export async function geocodeLocation(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

// Get nearby healthcare facilities using Overpass API
export async function fetchNearby(lat: number, lng: number, type: string) {
  const radius = 5000; // 5 km radius

  const query = `
    [out:json];
    (
      node["amenity"="${type}"](around:${radius}, ${lat}, ${lng});
      way["amenity"="${type}"](around:${radius}, ${lat}, ${lng});
      relation["amenity"="${type}"](around:${radius}, ${lat}, ${lng});
    );
    out center;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  const data = await res.json();

  return data.elements.map((item: any) => ({
    id: item.id,
    name: item.tags.name || "Unnamed Facility",
    address: item.tags.address || item.tags["addr:full"] || "No address available",
    lat: item.lat || item.center?.lat,
    lng: item.lon || item.center?.lon,
}));
}