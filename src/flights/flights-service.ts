import { FilterFlightQuery } from "../models/flights";

export const buildFilterQuery = (filter: FilterFlightQuery): string => {
  const params = new URLSearchParams();

  if (filter.type) params.append("type", filter.type.toString());
  if (filter.status) params.append("status", filter.status.toString());
  if (filter.searchName)
    params.append("searchName", filter.searchName.toString());
  if (filter.scheduleTimeFrom)
    params.append("scheduleTimeFrom", filter.scheduleTimeFrom.toISOString());
  if (filter.scheduleTimeTo)
    params.append("scheduleTimeTo", filter.scheduleTimeTo.toISOString());
  if (filter.gateId) params.append("gateId", filter.gateId.toString());

  return params.toString();
};
