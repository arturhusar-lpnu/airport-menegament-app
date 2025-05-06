import { Flight } from "./flights";

export type SeatClass = "business" | "economy";

export enum LuggageStatus {
  Boarded = "boarded",
  Received = "received",
  ToBeReceived = "to_be_received",
  Lost = "lost",
  Pending = "pending",
}

export type Ticket = {
  id?: number;
  seatClass: SeatClass;
  flightId: number;
  price: number;
  passenger?: Passenger;
};

export type Passenger = {
  id: number;
  email: string;
  username: string;
};

export type RegisteredTicket = {
  id: number;
  ticket: Ticket;
  seat: FlightSeat;
  luggage?: Luggage;
};

export type Luggage = {
  id: number;
  weight: string;
  status: LuggageStatus;
  passenger: Passenger;
  ticket: RegisteredTicket;
};

export type FlightSeat = {
  id: number;
  seatNumber: string;
  flight?: Flight;
};
