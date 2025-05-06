import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import {
  Flight,
  FlightStatus,
  FlightType,
  Gate,
  RegistrationStatus,
} from "../models/flights";
import { toast } from "react-toastify";
import { parseReportData } from "../utils/WeatherHelper";
import { GiAirplaneArrival, GiAirplaneDeparture } from "react-icons/gi";
import WeatherIcon from "../components/WeatherIcon";
import { RxReload } from "react-icons/rx";
import RearrangeModal from "../components/RearrangeModal";
import Spinner from "../components/Spinner";

const GateReportPage = () => {
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [loadingDates, setLoadingDate] = useState<boolean>(true);
  const { gateId } = useParams();
  const { token } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<FlightType>(FlightType.Arriving);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [gate, setGate] = useState<Gate>();
  const [showRearrange, setShowRearrange] = useState<boolean>(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight>();
  const navigate = useNavigate();
  const tabs = [
    {
      type: FlightType.Arriving,
      label: "Arriving",
      icon: <GiAirplaneArrival size={40} />,
    },
    {
      type: FlightType.Departing,
      label: "Departing",
      icon: <GiAirplaneDeparture size={40} />,
    },
  ];

  const getGate = async () => {
    setLoadingDate(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/gates/${gateId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const gateResponse = await res.json();

      if (!res.ok) {
        throw new Error(gateResponse.message);
      }

      setGate(gateResponse);
    } catch (e) {
      toast.error(`Report fetch error: ${(e as Error).message}`);
    } finally {
      setLoadingDate(false);
    }
  };

  const getReport = async () => {
    try {
      const date = new Date().toISOString();

      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/report?from=${date}&to=2025-05-20T14:45:50.000Z`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const weatherResponse = await res.json();

      if (!res.ok) {
        throw new Error(weatherResponse.message);
      }

      const report = parseReportData(weatherResponse);
      setReport(report);
    } catch (e) {
      toast.error(`Report fetch error: ${(e as Error).message}`);
    }
  };

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

  useEffect(() => {
    getGate();
  }, []);

  useEffect(() => {
    getGate();
    if (triggerFetch) {
      getReport();
      setTriggerFetch(false);
    }
  }, [triggerFetch]);

  const dataForTab = report?.[activeTab];
  const dates = dataForTab ? Object.keys(dataForTab) : [];

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50">
      <div className="flex flex-row text-xl gap-1 font-semibold text-gray-500">
        <span
          onClick={() => navigate("/gates")}
          className="hover:cursor-pointer hover:underline"
        >
          Gates /{" "}
        </span>
        <span>Gate {gate?.gateNumber}</span>
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center space-x-8 pb-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            className={`flex flex-row items-center hover:cursor-pointer justify-center gap-3 px-6 py-2 font-semibold text-lg rounded-md hover:bg-blue-100 hover:text-blue-500 transition-all duration-300 ${
              activeTab === tab.type
                ? "border-b-4 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.type)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date selection and refresh button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 overflow-x-auto">
          {loadingDates ? (
            <Spinner loading={loadingDates} />
          ) : dates.length > 0 ? (
            dates.map((date) => (
              <button
                className={`rounded px-4 py-2 text-lg font-semibold hover:bg-blue-700 hover:text-blue-200 ${
                  date === selectedDate
                    ? "bg-blue-500 text-blue-100"
                    : "bg-gray-200 text-black"
                }`}
                key={date}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </button>
            ))
          ) : (
            <div className="text-xl text-gray-600">No Available Dates</div>
          )}
        </div>

        <button
          className="rounded bg-blue-500 p-4 text-blue-100 hover:bg-blue-700 hover:text-blue-200"
          onClick={() => setTriggerFetch(true)}
        >
          <RxReload size={24} />
        </button>
      </div>

      {/* If no date selected */}
      {!loadingDates && !selectedDate && dates.length > 0 && (
        <div className="flex justify-center items-center bg-gray-300 rounded-lg p-4 min-h-32">
          <span className="text-2xl text-black">Choose a Date</span>
        </div>
      )}
      {!loadingDates && !selectedDate && dates.length === 0 && (
        <div className="flex justify-center items-center bg-gray-300 rounded-lg p-4 min-h-32">
          <span className="text-2xl text-black">No Flights</span>
        </div>
      )}

      {/* Flight details */}
      <div className="flex flex-col gap-6">
        {selectedDate &&
          dataForTab?.[selectedDate]?.flights.map(
            (flight: Flight, idx: number) => {
              const weather = dataForTab[selectedDate].weatherReports[idx];
              const shouldRearrange = dataForTab[selectedDate].shouldRearrange;
              const onRegistration = flight.registrations.some(
                (r) => r.registrationStatus === RegistrationStatus.Open
              );
              return (
                <div
                  key={idx}
                  className="flex flex-col bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-blue-700">
                      Flight: {flight.flightNumber} &lt;{flight.flightName}&gt;
                    </span>
                    <div className="flex gap-2">
                      <div
                        className={`rounded-lg px-3 py-1 ${getStatusStyle(
                          flight.status
                        )}`}
                      >
                        Status: {flight.status}
                      </div>
                      {shouldRearrange && !onRegistration && (
                        <div className="rounded-2xl bg-red-400 text-white p-2">
                          Rearrangement Needed
                        </div>
                      )}
                      {onRegistration && (
                        <div className="rounded-2xl bg-blue-400 text-white p-2">
                          On Registration
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Time: {new Date(flight.scheduleTime).toLocaleDateString()}{" "}
                    {new Date(flight.scheduleTime).toLocaleTimeString()}
                  </p>
                  <div className="flex items-center justify-center text-black">
                    Weather: {weather?.condition?.text}
                    <WeatherIcon givenForecast={weather} />
                  </div>
                  <div className="flex justify-end">
                    {!onRegistration && (
                      <button
                        onClick={() => {
                          setSelectedFlight(flight);
                          setShowRearrange(true);
                        }}
                        className={`rounded-md hover:cursor-pointer ${
                          shouldRearrange
                            ? "bg-red-200 text-red-500 hover:bg-red-600 hover:text-white"
                            : "bg-blue-500 text-blue-200 hover:bg-blue-600"
                        } p-3`}
                      >
                        Rearrange
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>

      {/* Rearrange Modal */}
      {selectedFlight && (
        <RearrangeModal
          initalTime={new Date(selectedFlight!.scheduleTime).toISOString()}
          isOpen={showRearrange}
          onClose={() => setShowRearrange(false)}
          onRearrange={() => {
            setTriggerFetch(true);
            setShowRearrange(false);
          }}
          flight={selectedFlight!}
        />
      )}
    </div>
  );
};

export default GateReportPage;
