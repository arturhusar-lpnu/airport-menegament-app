import { Flight } from "./flights";

export type SeatClass = "business" | "economy";

export type LuggageStatus =
  | "boarded"
  | "lost"
  | "received"
  | "to_be_received"
  | "pending";

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
  luggages?: Luggage[];
};

export type Luggage = {
  id: number;
  weight: number;
  status: LuggageStatus;
  passenger: Passenger;
  ticket: RegisteredTicket;
};

export type FlightSeat = {
  id: number;
  seatNumber: string;
  flight?: Flight;
};
