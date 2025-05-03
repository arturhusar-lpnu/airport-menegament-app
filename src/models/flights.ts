import { FlightSeat, SeatClass, Ticket } from "./tickets";

export interface Flight {
  id: number;
  flightType: FlightType;
  scheduleTime: Date;
  status: FlightStatus;
  flightPrices: FlightPrice[];
  aircraft: Aircraft;
  flightNumber: string;
  gate: Gate;
  airline: Airline;
  airport: Airport;
  flightName: string;
  tickets: Ticket[];
  flightSeats: FlightSeat[];
}

export interface FlightPrice {
  seatClass: SeatClass;
  price: number;
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

export interface Aircraft {
  id: number;
  businessSeats: number;
  economySeats: number;
  trunkCapacity: number;
  model: Model;
}

export interface Model {
  id: number;
  modelName: string;
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

export class FilterFlightQuery {
  type?: FlightType | null;
  status?: FlightStatus | null;
  searchName?: string | null;
  scheduleTimeFrom?: Date | null;
  scheduleTimeTo?: Date | null;
  gateId?: number | null;
}
