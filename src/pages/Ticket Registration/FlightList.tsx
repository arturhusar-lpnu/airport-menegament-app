import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Flight, FlightType } from "../../models/flights";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { buildFilterQuery } from "../../flights/flights-service";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import {
  MdFlight,
  MdOutlineKeyboardArrowRight,
  MdSchedule,
} from "react-icons/md";

const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { gateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async () => {
    const filterQuery = buildFilterQuery({
      gateId: parseInt(gateId as string),
      type: FlightType.Departing,
    });
    const url = `http://localhost:3000/api/v1/flights?${filterQuery}`;
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();

      if (response?.message) {
        throw new Error(`Error fetching flights ${response.message}`);
      }
      const flights: Flight[] = response;
      const upcoming = flights.filter(
        (f) => new Date(f.scheduleTime) >= new Date()
      );
      setFlights(upcoming);
    } catch (err) {
      toast.error("Failed to fetch flights" + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id: number) => {
    navigate(`${location.pathname}/flight/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
        <MdFlight className="mr-2" /> Flights
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          flights && (
            <>
              {flights.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                  <MdFlight className="text-5xl mb-2 text-gray-400" />
                  <p className="text-xl">No flights available</p>
                </div>
              ) : (
                flights.map((f) => (
                  <div
                    key={f.id}
                    className="group hover:bg-blue-50 transition-all duration-200 border-b border-blue-100 last:border-b-0"
                  >
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer"
                      onClick={() => handleClick(f.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white">
                          <MdFlight className="text-2xl" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-semibold text-blue-700">
                              {f.flightNumber}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-lg text-gray-800">
                              {f.flightName}
                            </span>
                            <span className="text-md text-blue-800">
                              {f.tickets.length} tickets
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MdSchedule className="mr-1" />
                            <span>
                              {new Date(f.scheduleTime).toLocaleDateString()} •{" "}
                              {new Date(f.scheduleTime).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-500 transition-colors">
                        <MdOutlineKeyboardArrowRight className="text-2xl text-blue-500 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default FlightList;
