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
            <div key={date} className="flex flex-col gap-4">
              <div className="flex w-auto rounded-sm bg-blue-400 text-2xl text-white p-4 sticky top-0 z-20">
                {date}
              </div>
              {/* <h3></h3> */}
              <div className="overflow-y-auto max-h-[500px]">
                <table className="table table-zebra rounded-sm w-full items-center sticky top-16 z-10">
                  <thead>
                    <tr className="bg-gray-100 h-20">
                      <th>{type === FlightType.Arriving ? "Arr" : "Dep"}</th>
                      <th>{type === FlightType.Arriving ? "From" : "To"}</th>
                      <th>Airline</th>
                      <th>Flight Number</th>
                      <th>Terminal</th>
                      <th>Gate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedFlights[date].map((flight) => (
                      <tr
                        key={flight.id}
                        className="hover:bg-blue-50 cursor-pointer h-20"
                        onClick={() => handleNavigation(flight.id)}
                      >
                        <td className="text-center">
                          {new Date(flight.scheduleTime).toLocaleTimeString()}
                        </td>
                        <td className="text-center">
                          {flight.airport.cityName}
                        </td>
                        <td className="text-center">
                          {flight.airline.airlineName}
                        </td>
                        <td className="text-center">{flight.flightNumber}</td>
                        <td className="text-center">
                          {flight.gate.terminal.terminalName}
                        </td>
                        <td className="text-center">
                          {flight.gate.gateNumber}
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge ${
                              flight.status === "delayed"
                                ? "badge-error"
                                : "badge-success"
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
