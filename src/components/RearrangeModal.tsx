import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import { useParams } from "react-router";
import WeatherIcon, { Forecast } from "./WeatherIcon";
import { Flight, FlightStatus, Gate } from "../models/flights";
import { isSameHour } from "../utils/dateHelper";

interface Props {
  isOpen: boolean;
  initalTime: string;
  flight: Flight;
  onRearrange: () => void;
  onClose: () => void;
}

const RearrangeModal = ({
  isOpen,
  initalTime,
  flight,
  onRearrange,
  onClose,
}: Props) => {
  const { gateId } = useParams();
  const { token } = useAuth();
  const [activeHour, setActiveHour] = useState<number>(12);
  const [activeGateId, setGateId] = useState<number>(parseInt(gateId!));
  const [rearrangeTime, setRearrangeTime] = useState<Date>(
    new Date(initalTime)
  );
  const [suggestedReports, setSuggestedReport] = useState<Forecast[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<FlightStatus>(
    FlightStatus.Scheduled
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState<Forecast>();
  const [freeGates, setFreeGates] = useState<Gate[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingGates, setIsLoadingGates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const hoursTabs = [
    {
      label: "12 hours",
      value: 12,
    },
    {
      label: "24 hours",
      value: 24,
    },
    {
      label: "48 hours",
      value: 48,
    },
  ];

  const getFreeGates = async () => {
    setIsLoadingGates(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/details/free-gates?date=${new Date(
          rearrangeTime
        ).toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message);
      }

      const gates: Gate[] = response;

      setFreeGates(gates);
    } catch (error) {
      toast.error(`Fetch free gates: ${(error as Error).message}`);
    } finally {
      setIsLoadingGates(false);
    }
  };

  const getTimeSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const date = new Date(initalTime);
      date.setHours(date.getHours() + 3);
      console.log(date.toISOString());
      // console.log(date);
      // console.log(date);
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/report/sugest?from=${date}&hours=${activeHour}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      setSuggestedReport(response);
    } catch (error) {
      toast.error(`Fetch suggestions: ${(error as Error).message}`);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const updateGate = async (flight: Flight) => {
    try {
      const updateGateRes = await fetch(
        `http://localhost:3000/api/v1/flights/${flight.id}/update-flight/gate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gateId: activeGateId }),
        }
      );

      const response = await updateGateRes.json();

      if (!updateGateRes.ok) {
        throw new Error(response.message);
      }
      toast.info("Gate Updated");
    } catch (error) {
      toast.error(`Gate Update: ${(error as Error).message}`);
    }
  };

  const updateTime = async (flight: Flight) => {
    try {
      const updateTimeRes = await fetch(
        `http://localhost:3000/api/v1/flights/${flight.id}/update-flight/shedule-time`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newScheduleTime: new Date(rearrangeTime).toISOString(),
          }),
        }
      );

      const response = await updateTimeRes.json();

      if (!updateTimeRes.ok) {
        throw new Error(response.message);
      }
      toast.info("Time Updated");
    } catch (error) {
      toast.error(`Time update: ${(error as Error).message}`);
    }
  };

  const updateStatus = async (flight: Flight) => {
    try {
      const updateStatusRes = await fetch(
        `http://localhost:3000/api/v1/flights/${flight.id}/update-flight/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );

      const response = await updateStatusRes.json();

      if (!updateStatusRes.ok) {
        throw new Error(response.message);
      }
      toast.info("Status Updated");
    } catch (error) {
      toast.error(`Status update: ${(error as Error).message}`);
    }
  };

  const rearrangeFlight = async (flight: Flight) => {
    setIsSaving(true);
    try {
      const updates = [];

      if (!isSameHour(rearrangeTime, new Date(flight.scheduleTime))) {
        updates.push(updateTime(flight));
      } else {
        toast.info("This Time is already set");
      }
      if (selectedStatus !== flight.status) {
        updates.push(updateStatus(flight));
      } else {
        toast.info("This Satus is already set");
      }
      if (activeGateId !== flight.gate.id) {
        updates.push(updateGate(flight));
      } else {
        toast.info("This Gate is already set");
      }

      if (updates.length === 0) {
        toast.info("No changes detected.");
        return;
      }

      await Promise.all(updates);
      toast.success("Flight rearranged");
      onRearrange();
    } catch (error) {
      toast.error(`Rearrange: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getTimeSuggestions();
  }, [activeHour, isOpen]);

  useEffect(() => {
    getFreeGates();
  }, [activeHour]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-lg w-auto text-center">
        <div className="flex flex-row text-black text-3xl">
          <span className="font-semibold">
            Flight Rearrange : {`${flight.flightNumber} <${flight.flightName}>`}
          </span>
        </div>
        <div className="flex flex-row w-full items-center border border-gray-300 rounded-md p-4 ">
          <span className="font-semibold text-lg">Interval</span>
          <div className="flex gap-4 p-4 w-full justify-center">
            {hoursTabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center rounded-md justify-center gap-2 px-4 py-2 font-semibold text-lg hover:cursor-pointer ${
                  activeHour === tab.value
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 bg-gray-200 hover:text-blue-300"
                }`}
                onClick={() => {
                  setActiveHour(tab.value);
                  const date = new Date(initalTime);
                  date.setHours(date.getHours() + tab.value);
                  setRearrangeTime(date);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start justify-center max-h-100 overflow-y-auto border border-gray-300 rounded-md p-2 w-full">
          <span className="font-semibold text-xl mb-2">Suggested Hours</span>
          {selectedSuggestion && (
            <div className="rounded-md p-2 bg-blue-500 text-white text-lg">
              Selected {new Date(selectedSuggestion.time).toDateString()}
              {" : "}
              {new Date(selectedSuggestion.time).toTimeString().split(" ")[0]}
            </div>
          )}
          <button
            className="text-blue-500 text-md underline"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            {showSuggestions ? "Hide" : "Show"}
          </button>

          {isLoadingSuggestions ? (
            <p className="text-gray-500 text-sm">Loading suggestions...</p>
          ) : showSuggestions && suggestedReports.length > 0 ? (
            <div className="flex flex-col items-start max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 w-full">
              {suggestedReports.map((suggestion, index) => {
                const localTime = new Date(suggestion.time);
                const label = `${localTime.toLocaleDateString()} ${localTime.toLocaleTimeString()}`;
                const isSelected = selectedSuggestion?.time === suggestion.time;

                return (
                  <label
                    key={index}
                    className={`flex items-center justify-between w-full p-2 gap-2 rounded-md cursor-pointer ${
                      isSelected ? "bg-blue-100" : "hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="suggestion"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedSuggestion(suggestion);
                          setRearrangeTime(new Date(suggestion.time));
                        }}
                        className="form-radio text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {suggestion.condition.text}
                      </span>
                      <WeatherIcon givenForecast={suggestion} />
                    </div>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-center gap-4 border border-gray-300 rounded-md p-4">
          <label htmlFor="flight-status" className="text-md font-medium">
            Status
          </label>
          <select
            id="flight-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as FlightStatus)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            {selectedSuggestion ? (
              <option value="delayed">Delayed</option>
            ) : (
              <>
                <option value="landed">Landed</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>
        </div>
        {isLoadingGates ? (
          <p className="text-gray-500 text-sm">Loading free gates...</p>
        ) : (
          freeGates.length > 0 && (
            <div className="flex flex-row items-center gap-2 border border-gray-300 rounded-md p-4">
              <span className="font-semibold text-lg">Gate</span>
              <div className="flex flex-row gap-2 items-start justify-center">
                {freeGates.map((gate) => (
                  <div
                    key={gate.id}
                    className={`rounded-md p-2 hover:cursor-pointer ${
                      activeGateId == gate.id
                        ? "bg-blue-400 text-blue-100"
                        : "bg-gray-200 text-black"
                    }`}
                    onClick={() => {
                      if (gate.id == activeGateId) {
                        setGateId(parseInt(gateId!));
                        return;
                      }
                      setGateId(gate.id);
                    }}
                  >
                    {gate.gateNumber}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
        <div className="flex flex-row gap-4 items-end justify-end">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-lg bg-gray-400 text-black hover:cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => rearrangeFlight(flight)}
            disabled={isSaving}
            className={`rounded-md px-4 py-2 text-lg ${
              isSaving
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save & Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RearrangeModal;
