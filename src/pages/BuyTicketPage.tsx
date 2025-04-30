import { useEffect, useState } from "react";
import { Flight } from "../models/flights";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { SeatClass, Ticket } from "../models/tickets";

const BuyTicketPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState<Flight>();
  const { token } = useAuth();
  const navigate = useNavigate();

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

        const businessCost = flight!.flightPrices.filter(
          (f) => f.seatClass == "business"
        )[0].price;
        const economyCost = flight!.flightPrices.filter(
          (f) => f.seatClass == "economy"
        )[0].price;

        setTicketOptions({
          business: businessCost,
          economy: economyCost,
        });
        setTicketPrice(economyCost); // default

        const availabilityRes = await fetch(
          `http://localhost:3000/api/v1/tickets/details/available`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const availabilityData = await availabilityRes.json();
        const isAvailable =
          quantity + availabilityData.ticket_count > availabilityData.seats
            ? true
            : false;
        setAvailableTickets(availabilityData);
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
        submitTickets(updatedTickets);
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

      toast.success(`Successfully bought ${tickets.length} ticket(s)`);
      // navigate("/my-tickets");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const tabs = ["Business", "Economy"];

  return (
    flight && (
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="text-xl font-semibold">{flight.flightNumber}</div>
        <div>{flight.flightName}</div>
        <div className="text-gray-600">
          {flight.scheduleTime.toLocaleString()}
        </div>

        <div className="flex space-x-4">
          {tabs.map((tab) => {
            const tabKey = tab.toLowerCase() as SeatClass;
            return (
              <button
                key={tab}
                className={`px-4 py-2 font-medium rounded ${
                  activeTab === tabKey
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => {
                  setActiveTab(tabKey);
                  setTicketClass(tabKey);
                  setTicketPrice(ticketOptions[tabKey]);
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="text-lg font-medium">Price: ${price}</div>

        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="text-sm font-medium">
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

        {currentModalIndex !== null && (
          <TicketModal
            index={currentModalIndex}
            ticket={pendingTickets[currentModalIndex]}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            ticketOptions={ticketOptions}
          />
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

  const handleConfirm = () => {
    const updatedTicket: Ticket = {
      ...ticket,
      seatClass: selectedClass,
      price: ticketOptions[selectedClass],
    };
    onConfirm(updatedTicket);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
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
