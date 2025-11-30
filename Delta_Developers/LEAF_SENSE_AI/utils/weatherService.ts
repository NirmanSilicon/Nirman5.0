import { saveWeatherData, getCachedWeather, WeatherData } from "./storage";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherTips {
  disease: string;
  tips: string[];
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  const cached = await getCachedWeather();
  if (cached) {
    return cached;
  }

  try {
    const url = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();
    
    const weatherCode = data.current.weather_code;
    const condition = getWeatherCondition(weatherCode);

    const weather: WeatherData = {
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      condition,
      location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      timestamp: Date.now(),
    };

    await saveWeatherData(weather);
    return weather;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export function getWeatherBasedTips(
  weather: WeatherData | null,
  disease?: string
): string[] {
  const tips: string[] = [];

  if (!weather) {
    return [
      "Unable to fetch weather data. Check your location settings.",
      "General tip: Regularly inspect your crops for early signs of disease.",
    ];
  }

  if (weather.humidity > 80) {
    tips.push("High humidity detected. Fungal diseases spread faster in humid conditions.");
    tips.push("Ensure good air circulation between plants to reduce moisture buildup.");
    tips.push("Avoid watering in the evening to prevent overnight moisture.");
  } else if (weather.humidity > 60) {
    tips.push("Moderate humidity. Good time for preventive fungicide application if needed.");
  } else {
    tips.push("Low humidity conditions. Water stress may make plants more susceptible.");
  }

  if (weather.temperature > 30) {
    tips.push("High temperatures can stress plants. Ensure adequate watering.");
    tips.push("Consider shade nets during peak sun hours if possible.");
  } else if (weather.temperature > 20 && weather.temperature <= 30) {
    tips.push("Optimal growing temperature. Perfect time for most agricultural activities.");
  } else if (weather.temperature < 15) {
    tips.push("Cool temperatures. Some fungal diseases like late blight thrive in cool, wet conditions.");
    tips.push("Monitor for signs of cold-weather diseases.");
  }

  if (weather.condition === "Rain" || weather.condition === "Drizzle") {
    tips.push("Rainy conditions favor disease spread. Inspect crops after rain clears.");
    tips.push("Avoid walking through wet fields to prevent spreading pathogens.");
  }

  if (disease && disease !== "healthy") {
    tips.push(...getDiseaseSpecificWeatherTips(disease, weather));
  }

  return tips;
}

function getDiseaseSpecificWeatherTips(disease: string, weather: WeatherData): string[] {
  const tips: string[] = [];

  switch (disease) {
    case "early_blight":
      if (weather.humidity > 70) {
        tips.push("Early blight spreads quickly in high humidity. Remove infected leaves promptly.");
      }
      if (weather.temperature > 25) {
        tips.push("Warm temperatures with moisture favor early blight. Increase fungicide frequency.");
      }
      break;

    case "late_blight":
      if (weather.temperature < 20 && weather.humidity > 70) {
        tips.push("Current conditions are ideal for late blight. Apply preventive fungicides immediately.");
      }
      if (weather.condition === "Rain") {
        tips.push("Rain can rapidly spread late blight spores. Inspect all plants after rain stops.");
      }
      break;

    case "rust":
      if (weather.humidity > 80) {
        tips.push("Rust thrives in high humidity. Improve plant spacing for better air flow.");
      }
      tips.push("Remove and destroy infected leaves to prevent rust spore spread.");
      break;

    default:
      break;
  }

  return tips;
}

export function formatTemperature(celsius: number, useFahrenheit = false): string {
  if (useFahrenheit) {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${celsius}°C`;
}
