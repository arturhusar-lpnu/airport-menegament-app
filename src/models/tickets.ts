export type SeatClass = "business" | "economy";

export type Ticket = {
  seatClass: SeatClass;
  flightId: number;
  price: number;
};
