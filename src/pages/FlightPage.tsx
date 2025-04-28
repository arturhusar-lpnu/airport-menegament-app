import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Flight, FlightType } from "../models/flights";

const FlightPage = ({ id }: { id: number }) => {
  const [flight, setFlight] = useState<Flight>();
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/v1/flgihts/${id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorize: `Bearer ${token}`,
          },
        });

        const response = await res.json();

        if (response?.message) {
          throw new Error("Error fetching flight " + response.message);
        }
        setFlight(response);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const from =
    flight?.type == FlightType.Arriving ? flight?.airport.cityName : "Lemberg";
  const to =
    flight?.type == FlightType.Arriving ? "Lemberg" : flight?.airport.cityName;

  return (
    <div>
      <h2>Flight</h2>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <>
          <div>{flight?.flightName}</div>
          <div className="flex flex-row">
            <div>
              <span>Airline : {flight?.airline.airlineName}</span>
              <span> Aircraft : {flight?.airline.airlineName}</span>
              <span>Airport: {flight?.airport.airportName}</span>
            </div>
            <div>
              <span>Date : {flight?.scheduleTime.toISOString()}</span>
              <span>From : {from}</span>
              <span>To : {to}</span>
              <span>Status : {flight?.status}</span>
            </div>
            <div>
              <span>Terminal : {flight?.gate.terminal.terminalName}</span>

              <span>Check-In : {flight?.gate.gateNumber}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlightPage;
