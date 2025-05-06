import { useEffect, useState } from "react";
import { Flight, FlightType, FilterFlightQuery } from "../models/flights";
import { buildFilterQuery } from "../flights/flights-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const FlightsTable = ({
  type,
  query,
  triggerFetch,
  setTrigerFetch,
}: {
  type: FlightType;
  query?: FilterFlightQuery;
  triggerFetch: boolean;
  setTrigerFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const filterQuery = query ? buildFilterQuery(query) : "";
    const url = `http://localhost:3000/api/v1/flights?${filterQuery}`;
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();

      if (response?.message) {
        throw new Error(`Error fetching flights ${response.message}`);
      }

      setFlights(response);
    } catch (err) {
      toast.error("Failed to fetch flights" + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!triggerFetch) {
      return;
    }
    fetchData();
    setTrigerFetch(false);
  }, [triggerFetch, type, query]);

  const handleNavigation = (id: number) => {
    navigate(`/flights/flight/${id}`);
  };

  const groupedFlights = flights.reduce((acc, flight) => {
    const flightDate = new Date(flight.scheduleTime).toLocaleDateString();
    if (!acc[flightDate]) {
      acc[flightDate] = [];
    }
    acc[flightDate].push(flight);
    return acc;
  }, {} as Record<string, Flight[]>);

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div>
          {Object.keys(groupedFlights).map((date) => (
            <div key={date} className="flex flex-col gap-6 mb-8">
              <div className="bg-blue-500 text-white p-4 rounded-t-md text-2xl font-semibold shadow-md sticky top-0 z-20">
                {date}
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="table-auto w-full rounded-md shadow-md border border-gray-200">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="text-sm text-gray-700">
                      <th className="p-3 text-center">Flight Time</th>
                      <th className="p-3 text-center">
                        {type === FlightType.Arriving ? "From" : "To"}
                      </th>
                      <th className="p-3 text-center">Airline</th>
                      <th className="p-3 text-center">Flight Number</th>
                      <th className="p-3 text-center">Terminal</th>
                      <th className="p-3 text-center">Gate</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedFlights[date].map((flight) => (
                      <tr
                        key={flight.id}
                        className="hover:bg-blue-50 cursor-pointer text-sm transition-all duration-200"
                        onClick={() => handleNavigation(flight.id)}
                      >
                        <td className="text-center py-2">
                          {new Date(flight.scheduleTime).toLocaleTimeString()}
                        </td>
                        <td className="text-center py-2">
                          {flight.airport.cityName}
                        </td>
                        <td className="text-center py-2">
                          {flight.airline.airlineName}
                        </td>
                        <td className="text-center py-2">
                          {flight.flightNumber}
                        </td>
                        <td className="text-center py-2">
                          {flight.gate.terminal.terminalName}
                        </td>
                        <td className="text-center py-2">
                          {flight.gate.gateNumber}
                        </td>
                        <td className="text-center py-2">
                          <span
                            className={`badge py-1 px-3 rounded-full text-white ${
                              flight.status === "delayed"
                                ? "bg-gray-500"
                                : flight.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          >
                            {flight.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FlightsTable;
