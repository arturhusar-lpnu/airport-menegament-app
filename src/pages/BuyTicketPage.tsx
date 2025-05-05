import { useEffect, useState } from "react";
import { Flight } from "../models/flights";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Passenger, SeatClass, Ticket } from "../models/tickets";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { FaSearch, FaUser } from "react-icons/fa";
import { decodeToken } from "../auth/auth-service";

const BuyTicketPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState<Flight>();
  const { token } = useAuth();
  const [ticketClass, setTicketClass] = useState<SeatClass>("economy");
  const [activeTab, setActiveTab] = useState<SeatClass>("economy");
  const [availableTickets, setAvailableTickets] = useState<
    Record<SeatClass, number>
  >({
    business: 0,
    economy: 0,
  });
  const [ticketOptions, setTicketOptions] = useState<Record<SeatClass, number>>(
    {
      business: 0,
      economy: 0,
    }
  );

  const [price, setTicketPrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);

  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(
    null
  );

  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchAvailableTickets = async () => {
    try {
      const availabilityRes = await fetch(
        `http://localhost:3000/api/v1/tickets/details/available`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const availabilityData = await availabilityRes.json();

      const data = availabilityData.find((a: any) => a.id == flightId);

      if (data) {
        setAvailableTickets({
          business: data.available_business_seats,
          economy: data.available_economy_seats,
        });
      }
    } catch (error) {
      toast.error("Error fetching ticket availability");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const fres = await fetch(
          `http://localhost:3000/api/v1/flights/${flightId}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const flightResponse = await fres.json();

        if (flightResponse?.message) {
          throw new Error("Error fetching flight " + flightResponse.message);
        }
        flightResponse.scheduleTime = new Date(flightResponse.scheduleTime);
        setFlight(flightResponse);

        // if (!flight) throw new Error("Error: Flight has not been fetched");
        const fl: Flight = flightResponse;
        if (fl.flightPrices.length > 0) {
          const businessCost = fl.flightPrices.filter(
            (price) => price.seatClass == "business"
          )[0].price;
          const economyCost = fl.flightPrices.filter(
            (price) => price.seatClass == "economy"
          )[0].price;

          setTicketOptions({
            business: businessCost,
            economy: economyCost,
          });
          setTicketPrice(economyCost);
          await fetchAvailableTickets();
        }
      } catch (err) {
        toast.error((err as Error).message);
      }
    })();
  }, []);

  const initiateTicketPurchase = () => {
    if (!flight) {
      return;
    }
    const tickets: Ticket[] = Array.from({ length: quantity }).map(() => ({
      price,
      seatClass: ticketClass,
      flightId: flight.id,
    }));
    setPendingTickets(tickets);
    setCurrentModalIndex(0);
  };

  const handleModalConfirm = (updatedTicket: Ticket) => {
    const updatedTickets = [...pendingTickets];
    if (currentModalIndex !== null) {
      updatedTickets[currentModalIndex] = updatedTicket;
      setPendingTickets(updatedTickets);

      if (currentModalIndex + 1 < quantity) {
        setCurrentModalIndex(currentModalIndex + 1);
      } else {
        setCurrentModalIndex(null);
        setShowConfirmation(true);
        //submitTickets(updatedTickets);
      }
    }
  };

  const handleModalCancel = () => {
    setPendingTickets([]);
    setCurrentModalIndex(null);
  };

  const submitTickets = async (tickets: Ticket[]) => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/tickets/buy-ticket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tickets),
        }
      );

      const response = await res.json();
      if (response.message) throw new Error(response.message);

      setTimeout(() => {}, 10000);

      toast.success(
        `Successfully bought ${tickets.length} ticket${
          tickets.length == 1 ? "" : "s"
        }`
      );

      await fetchAvailableTickets();
      // navigate("/my-tickets");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const tabs = ["Business", "Economy"];
  return (
    flight && (
      <div className="flex items-start justify-center w-full min-h-[calc(100vh-64px)] bg-blue-100 p-8">
        {flight.flightPrices.length > 0 ? (
          <div className="border-1 bg-blue-50 border-black rounded-2xl grid grid-cols-2 justify-between  mx-2xl p-6 space-y-6 w-[50vw]">
            <div className="flex flex-col gap-6">
              <div className="text-xl font-bold">
                Flight {flight.flightNumber}
              </div>
              <div className="text-xl font-semibold flex items-center gap-4">
                <span>{flight.flightName.split("-")[0]}</span>
                <LiaLongArrowAltRightSolid className="text-3xl" />
                <span>{flight.flightName.split("-")[1]}</span>
              </div>
              <div className="text-gray-600 text-xl">
                Airline: {flight.airline.airlineName}
              </div>
              <div className="text-gray-600 text-xl">
                Date: {flight.scheduleTime.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex space-x-4">
                {tabs.map((tab) => {
                  const tabKey = tab.toLowerCase() as SeatClass;
                  return (
                    <button
                      key={tab}
                      className={`px-4 py-2 font-medium w-full rounded ${
                        activeTab === tabKey
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => {
                        setActiveTab(tabKey);
                        setTicketClass(tabKey);
                        setTicketPrice(ticketOptions[tabKey]);
                        setQuantity(0);
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="text-lg font-medium">Price: ${price}</div>
              <div className="text-lg font-medium">
                Available: {availableTickets[activeTab]} ticket
                {availableTickets[activeTab] == 1 ? "" : "s"}
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-lg font-medium">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  max={availableTickets[activeTab]}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border px-3 py-1 rounded w-24"
                />
              </div>

              <button
                onClick={initiateTicketPurchase}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Buy
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 shadow-md text-center">
            <h2 className="text-2xl font-bold mb-2">Ticket Sales Not Open</h2>
            <p className="text-gray-600">
              Prices have not been set yet. Please check back later.
            </p>
          </div>
        )}

        {currentModalIndex !== null && (
          <TicketModal
            index={currentModalIndex}
            ticket={pendingTickets[currentModalIndex]}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            ticketOptions={ticketOptions}
          />
        )}
        {showConfirmation && (
          <div className="fixed inset-0 backdrop-blur-md bg-opacity-40  flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] shadow-green-500/50">
              <h2 className="text-xl font-bold mb-4">Confirm Tickets</h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {pendingTickets.map((ticket, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded"
                  >
                    <div>
                      <p className="font-medium">Ticket {idx + 1}</p>
                      <p>Class: {ticket.seatClass}</p>
                      <p>Price: ${ticket.price}</p>
                      <p>
                        Passenger :{" "}
                        <span className="text-blue-600">
                          {ticket.passenger?.username}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingTickets([]);
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    submitTickets(pendingTickets);
                    setShowConfirmation(false);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default BuyTicketPage;

const TicketModal = ({
  index,
  ticket,
  onConfirm,
  onCancel,
  ticketOptions,
}: {
  index: number;
  ticket: Ticket;
  onConfirm: (updatedTicket: Ticket) => void;
  onCancel: () => void;
  ticketOptions: Record<SeatClass, number>;
}) => {
  const [selectedClass, setSelectedClass] = useState<SeatClass>(
    ticket.seatClass
  );
  const { token } = useAuth();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [filterPassengers, setFilterPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger>();
  const user = decodeToken(token);
  const fetchPassengers = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/gates/details/passengers/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.message) throw new Error(data.message);

      const passengers = data as Passenger[];
      setPassengers(passengers);
      setFilterPassengers(passengers);
    } catch (error) {
      toast.error("Failed to fetch passengers." + (error as Error).message);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, [token]);

  const searchPassenger = (search: string) => {
    const _passengers = passengers.filter((passenger) =>
      passenger.username.toLowerCase().includes(search.trim().toLowerCase())
    );

    setFilterPassengers(_passengers);
  };

  const handleConfirm = () => {
    const updatedTicket: Ticket = {
      ...ticket,
      seatClass: selectedClass,
      price: ticketOptions[selectedClass],
      passenger: selectedPassenger,
    };
    onConfirm(updatedTicket);
    setSelectedPassenger(undefined);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg shadow-xl w-lg">
        <h2 className="text-lg font-bold mb-4">Ticket {index + 1}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as SeatClass)}
              className="w-full border p-2 mt-1 rounded"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
            </select>
            <div className="text-lg font-medium">
              Price: ${ticketOptions[selectedClass]}
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Buying To Passenger:
            </label>

            {selectedPassenger ? (
              <div className="flex items-center gap-2 mb-4 bg-blue-50 px-4 py-2 rounded-xl">
                <FaUser className="text-blue-600" />
                <span className="text-blue-900">
                  {selectedPassenger.username == user?.username
                    ? "Me"
                    : selectedPassenger.username}
                </span>
              </div>
            ) : null}

            <div className="relative mb-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search Passenger"
                  className="flex-1 bg-transparent outline-none"
                  onChange={(e) => searchPassenger(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-40 border rounded-lg p-2 bg-gray-50 custom-scrollbar">
              {filterPassengers.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPassenger(p)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer rounded"
                >
                  <FaUser />
                  <span>
                    {p.username == user?.username ? "Me" : p.username}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
