import { useEffect, useState } from "react";
import { RegisteredTicket, Ticket } from "../models/tickets";
import { useAuth } from "../auth/AuthProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Flight } from "../models/flights";
import Spinner from "./Spinner";

const TicketList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [flight, setFlight] = useState<Flight>();
  const [triggerFetch, setTriggerFetch] = useState<boolean>();
  const [registeredTickets, setRegisteredTickets] = useState<
    RegisteredTicket[]
  >([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { gateId, flightId } = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [flightRes, regRes] = await Promise.all([
        fetch(`http://localhost:3000/api/v1/flights/${flightId}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(
          `http://localhost:3000/api/v1/gates/${gateId}/registered-tickets`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const flightResponse = await flightRes.json();
      const registeredResponse = await regRes.json();

      if (flightResponse.message) throw new Error(flightResponse.message);
      if (registeredResponse.message)
        throw new Error(registeredResponse.message);

      setFlight(flightResponse);
      setTickets(flightResponse.tickets || []);
      setRegisteredTickets(registeredResponse || []);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (triggerFetch) {
      fetchData();
      setTriggerFetch(false);
    }
  }, [gateId, flightId, token]);

  const isTicketRegistered = (ticketId: number) => {
    return registeredTickets.some((rt) => rt.ticket.id === ticketId);
  };

  if (loading || !flight) return <Spinner loading={loading} />;

  return (
    <div className="flex flex-col rounded-2xl shadow-lg shadow-blue-500/50 bg-blue-50 p-4 gap-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">
        Tickets for {flight.flightNumber} - {flight.flightName}
      </h2>

      <div className="flex flex-col gap-4">
        {tickets.map((ticket) => {
          const registered = isTicketRegistered(ticket.id!);
          const passengerName = ticket.passenger?.username || "Unassigned";

          return (
            <div
              key={ticket.id}
              className="w-full flex flex-row items-center justify-between border border-blue-200 bg-white p-4 rounded-xl shadow"
            >
              <div className="text-blue-500 font-medium text-lg">
                {ticket.seatClass} - {passengerName}
              </div>

              {registered ? (
                <div className="text-green-600 bg-green-100 px-4 py-2 rounded-xl text-sm font-semibold">
                  Registered
                </div>
              ) : (
                <button
                  onClick={() => {}}
                  className="text-blue-600 bg-blue-100 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketList;
