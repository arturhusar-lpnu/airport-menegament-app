export interface Flight {
  id: number;
  type: FlightType;
  scheduleTime: Date;
  status: FlightStatus;
  // terminal: Terminal;
  flightNumber: string;
  gate: Gate;
  airline: Airline;
  airport: Airport;
  flightName: string;
}

export enum FlightType {
  Arriving = "arriving",
  Departing = "departing",
}

export enum FlightStatus {
  Scheduled = "scheduled",
  Delayed = "delayed",
  Landed = "landed",
  Cancelled = "cancelled",
}

export interface Terminal {
  terminalId: number;
  terminalName: string;
}

export interface Gate {
  id: number;
  gateNumber: string;
  terminal: Terminal;
}

export interface Airline {
  id: number;
  airlineName: string;
}

export interface Airport {
  airportName: string;
  cityName: string;
}

export interface FilterFlightQuery {
  type?: FlightType | null;
  status?: FlightStatus | null;
  searchName?: string | null;
  scheduleTimeFrom?: Date | null;
  scheduleTimeTo?: Date | null;
  gateId?: number | null;
}
