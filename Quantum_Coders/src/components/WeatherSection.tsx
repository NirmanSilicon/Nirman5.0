import { useState } from "react";
import { Cloud, Droplets, MapPin, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  advice: string;
}

interface WeatherSectionProps {
  onWeatherFetched?: (data: WeatherData) => void;
}

export function WeatherSection({ onWeatherFetched }: WeatherSectionProps) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({
        title: "Enter City Name",
        description: "Please enter your city or district name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Using OpenWeather API - Add your free API key from openweathermap.org
      const API_KEY = "7025577557f85061fad9508d401538c4"; // Replace with your actual OpenWeather API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found or API error");
      }

      const data = await response.json();
      
      // Generate farming advice based on humidity
      const advice = data.main.humidity > 75
        ? "⚠️ High humidity detected! Avoid spraying in the morning. High fungal infection risk. Consider spraying in evening or wait for drier conditions."
        : "✓ Spraying and irrigation conditions are normal. Good time for field activities.";

      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        advice
      };

      setWeather(weatherData);
      onWeatherFetched?.(weatherData);
      
      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${city}`
      });
    } catch (error) {
      toast({
        title: "Weather Fetch Failed",
        description: "Could not fetch weather data. Please check city name and try again. Note: You need to add your OpenWeather API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Weather Information</h2>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your city or district"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              className="pl-10 text-base h-12"
            />
          </div>
          <Button onClick={fetchWeather} disabled={loading} size="lg">
            {loading ? "Loading..." : "Get Weather"}
          </Button>
        </div>

        {weather && (
          <div className="space-y-4 mt-6 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Thermometer className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-2xl font-bold text-foreground">{weather.temp}°C</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Droplets className="w-8 h-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                </div>
              </div>
            </div>

            <Card className={`p-4 ${weather.humidity > 75 ? 'bg-warning/10 border-warning' : 'bg-success/10 border-success'}`}>
              <h4 className="font-semibold text-foreground mb-2">Farming Advice</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {weather.advice}
              </p>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
