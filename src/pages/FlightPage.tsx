import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Flight, FlightStatus, FlightType } from "../models/flights";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosAirplane } from "react-icons/io";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

const FlightPage = () => {
  const [flight, setFlight] = useState<Flight>();
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOnGetTicket = () => {
    navigate(`/tickets/${id}/buy-ticket`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/v1/flights/${id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await res.json();

        if (response?.message) {
          throw new Error("Error fetching flight " + response.message);
        }
        response.scheduleTime = new Date(response.scheduleTime);
        setFlight(response);
        console.log(response.scheduleTime);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const getStatusStyle = (status: FlightStatus) => {
    switch (status) {
      case FlightStatus.Scheduled:
        return "text-blue-600 bg-blue-100";
      case FlightStatus.Delayed:
        return "text-yellow-700 bg-yellow-100";
      case FlightStatus.Landed:
        return "text-green-700 bg-green-100";
      case FlightStatus.Cancelled:
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const from =
    flight?.flightType == FlightType.Arriving
      ? flight?.airport.cityName
      : "Lemberg";
  const to =
    flight?.flightType == FlightType.Arriving
      ? "Lemberg"
      : flight?.airport.cityName;

  return (
    <div className="flex flex-col relative min-h-[calc(100vh-64px)] bg-blue-50 p-8">
      <img
        className="absolute inset-0 w-full h-[50vh] object-cover z-0"
        src="/images/shedule.avif"
        alt="flights"
      />
      <div className="absolute inset-0 h-[50vh] bg-black/60 z-10" />
      <h2 className="relative text-3xl font-bold text-white mb-8 z-10">
        Flight Details
      </h2>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        flight && (
          <div className="relative flex flex-col gap-6 bg-white rounded-xl shadow-md p-8 w-full max-w-5xl mx-auto z-20">
            <div className="text-2xl font-semibold text-gray-800 border-b pb-4">
              <div className="text-2xl font-semibold flex items-center gap-6 ">
                <span>{flight.flightName.split("-")[0]}</span>
                <LiaLongArrowAltRightSolid className="text-3xl" />
                <span>{flight.flightName.split("-")[1]}</span>
              </div>

              <div className="flex flex-row text-xl justify-between">
                <span className="font-semibold mt-4 mb-1 px-2 py-1 rounded w-fit bg-gray-100 text-black">
                  Airline : {flight?.airline.airlineName}
                </span>
                <span className="font-semibold mt-4 mb-1 px-2 py-1 rounded w-fit bg-blue-100 text-black">
                  {" "}
                  Aircraft : {flight?.aircraft.model.modelName}
                </span>
                <span
                  className={`font-semibold mt-4 mb-1 px-2 py-1 rounded w-fit ${getStatusStyle(
                    flight.status
                  )}`}
                >
                  Status : {flight.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 items-start">
              <div className="flex flex-col">
                <span className="font-semibold mb-1 px-2 py-1 rounded w-fit bg-gray-100">
                  Date :{" "}
                  {flight?.scheduleTime.toUTCString().split(",")[0] +
                    " " +
                    flight?.scheduleTime.toLocaleTimeString()}
                </span>

                <span className="font-semibold mt-4 mb-1 px-2 py-1 rounded w-fit bg-blue-100">
                  Terminal : {flight?.gate.terminal.terminalName.split(" ")[1]}
                </span>

                <span className="font-semibold mt-4 mb-1 px-2 py-1 rounded w-fit bg-gray-100">
                  Check-In : {flight?.gate.gateNumber}
                </span>
              </div>

              <div className="flex flex-col col-span-1">
                <span className="font-semibold text-lg px-2 py-1 rounded w-fit bg-blue-100">
                  From
                </span>
                <span className="font-semibold mb-1 px-2 py-1">
                  City: {from}
                </span>
                <span className="font-semibold mb-1 px-2 py-1">
                  {flight.flightType === FlightType.Departing
                    ? "Lemberg International Airport"
                    : flight.airport.airportName}
                </span>
              </div>

              <div className="flex flex-col col-span-1">
                <span className="font-semibold text-lg px-2 py-1 rounded w-fit bg-gray-100">
                  To
                </span>
                <span className="font-semibold mb-1 px-2 py-1">City: {to}</span>
                <span className="font-semibold mb-1 px-2 py-1">
                  {flight.flightType === FlightType.Arriving
                    ? "Lemberg International Airport"
                    : flight.airport.airportName}
                </span>
              </div>
            </div>
            <div className="flex gap-4 border-t-1 py-2">
              <button
                className="flex flex-rows gap-4 items-center justify-center bg-blue-500 rounded-md w-auto p-4 hover:cursor-pointer hover:bg-blue-600"
                onClick={handleOnGetTicket}
              >
                <span className="text-white text-md">Get Ticket</span>
                <IoIosAirplane size={35} color="white" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FlightPage;
