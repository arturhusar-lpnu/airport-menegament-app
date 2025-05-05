import { Forecast } from "../components/WeatherIcon";
import { Flight } from "../models/flights";

export interface ParsedReport {
  [flightType: string]: {
    [date: string]: {
      flights: Flight[];
      weatherReports: Forecast;
      shouldRearrange: boolean;
    };
  };
}

export function parseReportData(reportData: any): ParsedReport {
  const result: ParsedReport = {};

  for (const flightType of Object.keys(reportData)) {
    result[flightType] = {};

    const dateGroups = reportData[flightType];

    for (const date of Object.keys(dateGroups)) {
      const items = dateGroups[date];

      const flights = items.map((item: any) => item.flight);
      const weatherReports = items.map((item: any) => item.weather);
      const shouldRearrange = items.some((item: any) => item.shouldRearrange);

      result[flightType][date] = {
        flights,
        weatherReports,
        shouldRearrange,
      };
    }
  }

  return result;
}
