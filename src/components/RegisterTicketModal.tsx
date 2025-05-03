import { useEffect, useState } from "react";
import { Passenger } from "../models/tickets";
import { useAuth } from "../auth/AuthProvider";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { FlightSeat } from "../models/tickets";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  onRegistered: () => void;
};

const RegisterTicketModal = ({
  isOpen,
  onClose,
  ticketId,
  onRegistered,
}: Props) => {
  const { flightId, gateId } = useParams();

  const { token } = useAuth();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [filterPassengers, setFilterPassengers] = useState<Passenger[]>([]);
  const [seletedPassenger, setSelectedPassenger] = useState<Passenger>();
  const [seats, setSeats] = useState<FlightSeat[]>([]);
  const [filterSeats, setFilterSeats] = useState<FlightSeat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<FlightSeat>();

  const searchPassenger = (search: string) => {
    const _passengers = passengers.filter((passenger) =>
      passenger.username.toLowerCase().includes(search.trim().toLowerCase())
    );

    setFilterPassengers(_passengers);
  };

  const searchSeat = (search: string) => {
    const _seats = seats.filter((seat) =>
      seat.seatNumber.toLowerCase().includes(search.toLowerCase())
    );

    setFilterSeats(_seats);
  };

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

  const fetchSeats = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/flights/${flightId}/available-seats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.message) throw new Error(data.message);

      const taken = data.filter((d: any) => d.is_taken);
      const free = data.filter((d: any) => !d.is_taken);

      const flightSeats: FlightSeat[] = free.map((d: any) => ({
        id: d.seat_id,
        seatNumber: d.seat_number,
      }));

      const availablePassengers = filterPassengers.filter(
        (p) => !taken.some((t: any) => t.passenger_id === p.id)
      );
      if (availablePassengers.length > 0) {
        setPassengers(availablePassengers);
        setFilterPassengers(availablePassengers);
      }
      setSeats(flightSeats);
      setFilterSeats(flightSeats);
    } catch (error) {
      toast.error("Failed to fetch seats." + (error as Error).message);
    }
  };

  const registerTicket = async () => {
    if (!selectedSeat || !seletedPassenger) {
      toast.error("Please select both passenger and seat class.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/register-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticketId,
            passengerId: seletedPassenger.id,
            seatId: selectedSeat.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to register");

      toast.success("Ticket registered!");
      onRegistered();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchPassengers();
    fetchSeats();
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-blue-700 mb-6">
          Register Ticket
        </h3>

        {/* Passenger Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Passenger
          </label>

          {seletedPassenger ? (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 px-4 py-2 rounded-xl">
              <FaUser className="text-blue-600" />
              <span className="text-blue-900">{seletedPassenger.username}</span>
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

          <div className="overflow-y-auto max-h-40 border rounded-lg p-2 bg-gray-50">
            {filterPassengers.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPassenger(p)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer rounded"
              >
                <FaUser />
                <span>{p.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seat Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Seat
          </label>

          {selectedSeat ? (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 px-4 py-2 rounded-xl">
              <IoTicketOutline className="text-blue-600" />
              <span className="text-blue-900">{selectedSeat.seatNumber}</span>
            </div>
          ) : null}

          <div className="relative mb-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Seat"
                className="flex-1 bg-transparent outline-none"
                onChange={(e) => searchSeat(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-40 border rounded-lg p-2 bg-gray-50">
            {filterSeats.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSeat(s)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer rounded"
              >
                <IoTicketOutline />
                <span>{s.seatNumber}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={registerTicket}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTicketModal;
