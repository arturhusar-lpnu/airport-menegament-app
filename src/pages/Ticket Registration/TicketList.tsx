import { useEffect, useState } from "react";
import {
  Luggage,
  Passenger,
  RegisteredTicket,
  Ticket,
} from "../../models/tickets";
import { useAuth } from "../../auth/AuthProvider";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Flight } from "../../models/flights";
import Spinner from "../../components/Spinner";
import RegisterTicketModal from "../../components/Ticket Registration/RegisterTicketModal";
import RemoveRegistrationModal from "../../components/Ticket Registration/RemoveRegistrationModal";
import RegistrationTimer from "../../components/Ticket Registration/RegistrationTime";
import { MdAirplaneTicket, MdLuggage, MdPerson } from "react-icons/md";
import LuggageRegistraionModal from "../../components/Ticket Registration/LuggageRegistraionModal";

const TicketList = () => {
  const [isRegistrationActive, setIsRegistrationActive] =
    useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRemoveRegistrationModal, setRemoveRegistrationModal] =
    useState(false);
  const [showLuggaeModal, setShowLuggageModal] = useState(false);
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
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger>();
  const { gateId, flightId } = useParams();

  const getLuggageByRegisteredTicketId = (id: number): Luggage | undefined => {
    return registeredTickets.find((rt) => rt.id === id)?.luggage;
  };

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

  const handleLuggageButtonClick = (ticketId: number) => {
    if (!isRegistrationActive) {
      toast.warn("Start a registration session to adjust luggage data", {
        style: {
          color: "white",
          background: "black",
          padding: "12px 16px",
          borderRadius: "8px",
        },
      });
      return;
    }
    getRegistered(ticketId);
    const ticket = tickets.find((t) => t.id === ticketId);
    setSelectedPassenger(ticket?.passenger!);
    setShowLuggageModal(true);
  };

  const handleRemoveButtonClick = (ticketId: number) => {
    if (!isRegistrationActive) {
      toast.warn("Start a registration session to remove registry", {
        style: {
          color: "white",
          background: "black",
          padding: "12px 16px",
          borderRadius: "8px",
        },
      });
      return;
    }

    getRegistered(ticketId);
    setRemoveRegistrationModal(true);
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
    <div className="relative z-20 max-w-full mx-auto my-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 p-6">
        <div className="flex items-center mb-6 ">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white mr-4">
            <MdAirplaneTicket className="text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-blue-700">
            Tickets for {flight.flightNumber} - {flight.flightName}
          </h2>
        </div>

        <RegistrationTimer
          onStart={handleTimerStart}
          onStop={handleTimerStop}
          onExpire={handleTimerExpire}
          isRegistrationActive={isRegistrationActive}
          setIsRegistrationActive={setIsRegistrationActive}
        />

        <div className="space-y-4 mt-6">
          {tickets.map((ticket) => {
            const registered = isTicketRegistered(ticket.id!);
            const passengerName = ticket.passenger?.username || "Unassigned";

            return (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center mb-2">
                      {registered && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mr-3">
                          Registered
                        </span>
                      )}
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {ticket.seatClass}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <MdPerson className="mr-2" />
                      <span className="font-medium">{passengerName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {registered ? (
                      <>
                        <button
                          onClick={() => {
                            handleLuggageButtonClick(ticket.id!);
                            setSelectedPassenger(ticket.passenger);
                          }}
                          className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <MdLuggage className="mr-1" />
                          <span>Luggage</span>
                        </button>
                        <button
                          onClick={() => {
                            handleRemoveButtonClick(ticket.id!);
                          }}
                          className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <span>Remove Registration</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setTicketId(ticket.id!);
                          setShowRegisterModal(true);
                        }}
                        disabled={!isRegistrationActive}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          isRegistrationActive
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Register Ticket</h3>
              <p>Modal content would go here</p>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md mr-2"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )} */}
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
      <LuggageRegistraionModal
        gateId={parseInt(gateId!)}
        flightId={flight.id}
        isOpen={showLuggaeModal}
        passenger={selectedPassenger!}
        luggage={getLuggageByRegisteredTicketId(activeRegisteredTicketId)}
        registeredTicketId={activeRegisteredTicketId}
        onClose={() => setShowLuggageModal(false)}
        onConfirm={() => setTriggerFetch(true)}
      />
    </div>
  );
};

export default TicketList;
