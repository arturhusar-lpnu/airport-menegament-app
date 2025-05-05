import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWeatherIcon } from "../utils/getWeatherIcon";

export interface WeatherIconProps {
  size?: number;
  color?: string;
  givenForecast?: Forecast;
}

export interface Forecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: 1;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  size = 48,
  color = "#000",
  givenForecast,
}) => {
  const [forecast, setForecast] = useState<Forecast>();
  useEffect(() => {
    if (givenForecast) {
      setForecast(givenForecast);
    } else {
      (async () => {
        try {
          const from = new Date().toISOString();
          const to = new Date().toISOString();
          const res = await fetch(
            `http://localhost:3000/api/v1/weather/forecast?from=${encodeURIComponent(
              from
            )}&to=${encodeURIComponent(to)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const report = await res.json();

          if (report.message) throw new Error(report.message);

          setForecast(report);
        } catch (error) {
          toast.error((error as Error).message);
        }
      })();
    }
  }, [givenForecast]);

  return (
    <>
      {forecast && (
        <div className="flex flex-row items-center justify-center bg-transparent gap-2">
          {(() => {
            const IconComponent = getWeatherIcon(forecast.condition.code);
            return <IconComponent size={size} color={color} />;
          })()}
          <div
            className="flex flex-rows text-xl items-center justify-center"
            style={{ color }}
          >
            {forecast.temp_c}°C
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherIcon;
