import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Flight, FlightType } from "../models/flights";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { buildFilterQuery } from "../flights/flights-service";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

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

      setFlights(response);
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
    <div className="flex flex-col shadow-lg rounded-xl shadow-blue-500/50 bg-blue-50">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        flights && (
          <div>
            {flights.length == 0 ? (
              <div className="text-xl text-gray-400 p-6">No flights</div>
            ) : (
              flights.map((f) => (
                <div
                  key={f.id}
                  className="w-full flex flex-row border-b-10 border-b-blue-100 items-center justify-between p-6"
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-xl text-blue-500 font-semibold">
                      {f.flightNumber} : {f.flightName}
                    </span>
                    <span className="text-lg text-gray-500 font-semibold">
                      Date:{" "}
                      {`${new Date(
                        f.scheduleTime
                      ).toLocaleDateString()} : ${new Date(
                        f.scheduleTime
                      ).toLocaleTimeString()}`}
                    </span>
                  </div>

                  <MdOutlineKeyboardArrowRight
                    className="text-4xl hover:cursor-pointer text-blue-500"
                    onClick={() => handleClick(f.id)}
                  />
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FlightList;
