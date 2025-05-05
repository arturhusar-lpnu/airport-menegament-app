import { useEffect, useState } from "react";
import { RegisteredTicket, Ticket } from "../../models/tickets";
import { useAuth } from "../../auth/AuthProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Flight } from "../../models/flights";
import Spinner from "../../components/Spinner";
import RegisterTicketModal from "../../components/Ticket Registration/RegisterTicketModal";
import RemoveRegistrationModal from "../../components/Ticket Registration/RemoveRegistrationModal";
import RegistrationTimer from "../../components/Ticket Registration/RegistrationTime";

const TicketList = () => {
  const [isRegistrationActive, setIsRegistrationActive] =
    useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRemoveRegistrationModal, setRemoveRegistrationModal] =
    useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicketId, setTicketId] = useState<number>(0);
  const [activeRegisteredTicketId, setActiveRegisteredTicketId] =
    useState<number>(0);
  const [flight, setFlight] = useState<Flight>();
  const [triggerFetch, setTriggerFetch] = useState<boolean>(true);
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

  const handleTimerStart = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/start-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flightId: flightId,
            startedAt: new Date().toISOString(),
          }),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to start registration");
      }

      if (response.id) {
        localStorage.setItem("registrationId", response.id.toString());
      }

      const endTime = new Date(Date.now() + 15 * 60 * 1000);
      localStorage.setItem("registrationEndTime", endTime.toISOString());
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleTimerStop = async () => {
    try {
      const registrationId = localStorage.getItem("registrationId");
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/close-registration`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: registrationId,
            closedAt: new Date().toISOString(),
          }),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to stop registration");
      }
      localStorage.removeItem("registrationId");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (triggerFetch) {
      fetchData();
      setTriggerFetch(false);
    }
  }, [gateId, flightId, token, triggerFetch]);

  const handleTimerExpire = () => {
    setIsRegistrationActive(false);
  };

  const isTicketRegistered = (ticketId: number) => {
    return registeredTickets.some((rt) => rt.ticket.id === ticketId);
  };

  const getRegistered = (ticketId: number) => {
    const id = registeredTickets.filter((rt) => rt.ticket.id == ticketId)[0].id;

    setActiveRegisteredTicketId(id);
  };

  if (loading || !flight) return <Spinner loading={loading} />;

  return (
    <div className="flex flex-col rounded-2xl shadow-lg shadow-blue-500/50 bg-blue-50 p-4 gap-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">
        Tickets for {flight.flightNumber} - {flight.flightName}
      </h2>

      <div className="flex flex-col gap-4">
        <RegistrationTimer
          onStart={handleTimerStart}
          onStop={handleTimerStop}
          onExpire={handleTimerExpire}
          isRegistrationActive={isRegistrationActive}
          setIsRegistrationActive={setIsRegistrationActive}
        />
        {tickets.map((ticket) => {
          const registered = isTicketRegistered(ticket.id!);
          const passengerName = ticket.passenger?.username || "Unassigned";
          return (
            <div
              key={ticket.id}
              className="w-full flex flex-row items-center justify-between border border-blue-200 bg-white p-4 rounded-xl shadow"
            >
              <div className="text-blue-500 font-medium text-lg flex flex-row gap-2 items-center justify-center">
                {registered ? (
                  <div className="text-green-600 bg-green-100 px-4 py-2 rounded-xl text-sm font-semibold">
                    Registered
                  </div>
                ) : null}
                Class : {ticket.seatClass} Passenger: {passengerName}
              </div>

              {registered ? (
                <div className="flex flex-row gap-4">
                  <button
                    onClick={() => {
                      getRegistered(ticket.id!);
                      setRemoveRegistrationModal(true);
                    }}
                    className="text-red-400 bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold hover:cursor-pointer hover:bg-red-500 hover:text-white"
                  >
                    Remove Registration
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTicketId(ticket.id!);
                    setShowRegisterModal(true);
                  }}
                  disabled={!isRegistrationActive}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    isRegistrationActive
                      ? "text-blue-600 bg-blue-100 hover:bg-blue-500 hover:text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>
      <RegisterTicketModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        ticketId={activeTicketId}
        onRegistered={() => setTriggerFetch(true)}
      />
      <RemoveRegistrationModal
        isOpen={showRemoveRegistrationModal}
        onClose={() => setRemoveRegistrationModal(false)}
        registeredTicketId={activeRegisteredTicketId}
        onRemoved={() => setTriggerFetch(true)}
      />
    </div>
  );
};

export default TicketList;
