import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiCloud,
  WiFog,
  WiShowers,
  WiRain,
  WiRainWind,
  WiSnow,
  WiSnowflakeCold,
  WiSnowWind,
  WiThunderstorm,
  WiSleet,
  WiSprinkle,
  WiHail,
  WiStormShowers,
} from "react-icons/wi";
import { IconType } from "react-icons";

export const weatherIconMap: Record<number, IconType> = {
  1000: WiDaySunny, // Sunny
  1003: WiDayCloudy, // Partly cloudy
  1006: WiCloudy, // Cloudy
  1009: WiCloud, // Overcast
  1030: WiFog, // Mist
  1063: WiShowers, // Patchy rain possible
  1066: WiSnow, // Patchy snow possible
  1069: WiSleet, // Patchy sleet possible
  1072: WiSprinkle, // Freezing drizzle
  1087: WiThunderstorm, // Thunder
  1114: WiSnowWind, // Blowing snow
  1117: WiSnowWind, // Blizzard
  1135: WiFog, // Fog
  1147: WiFog, // Freezing fog
  1150: WiSprinkle, // Patchy drizzle
  1153: WiSprinkle, // Light drizzle
  1168: WiSleet, // Freezing drizzle
  1171: WiSleet, // Heavy freezing drizzle
  1180: WiShowers, // Patchy light rain
  1183: WiRain, // Light rain
  1186: WiRain, // Moderate rain at times
  1189: WiRain, // Moderate rain
  1192: WiRainWind, // Heavy rain at times
  1195: WiRainWind, // Heavy rain
  1198: WiSleet, // Light freezing rain
  1201: WiSleet, // Moderate freezing rain
  1210: WiSnowflakeCold, // Patchy light snow
  1213: WiSnow, // Light snow
  1225: WiSnowWind, // Heavy snow
  1237: WiHail, // Ice pellets
  1240: WiShowers, // Light rain shower
  1243: WiRain, // Heavy rain shower
  1246: WiRainWind, // Torrential rain shower
  1273: WiStormShowers, // Rain + thunder
  1276: WiThunderstorm, // Heavy rain + thunder
  1279: WiSnow, // Snow + thunder
  1282: WiSnowWind, // Heavy snow + thunder
};

export const getWeatherIcon = (code: number): IconType => {
  return weatherIconMap[code] || WiDaySunny;
};
