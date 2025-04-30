import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getWeatherIcon } from "../utils/getWeatherIcon";

interface WeatherIconProps {
  size?: number;
  color?: string;
}

interface Forecast {
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
}) => {
  const [forecast, setForecast] = useState<Forecast>();
  useEffect(() => {
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
  }, []);

  return (
    <>
      {forecast && (
        <div className="flex flex-row items-center justify-center bg-transparent gap-2">
          {(() => {
            const IconComponent = getWeatherIcon(forecast.condition.code);
            return <IconComponent size={size} color={color} />;
          })()}
          <div className="flex flex-rows text-white text-xl items-center justify-center">
            {forecast.temp_c}°C
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherIcon;
