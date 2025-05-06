import { useEffect, useState } from "react";
import { Luggage, LuggageStatus, Passenger } from "../../models/tickets";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthProvider";

interface Props {
  gateId: number;
  flightId: number;
  registeredTicketId: number;
  passenger: Passenger;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  luggage?: Luggage;
}

const LuggageRegistraionModal = ({
  gateId,
  flightId,
  registeredTicketId,
  passenger,
  isOpen,
  onClose,
  onConfirm,
  luggage,
}: Props) => {
  const { token } = useAuth();
  const [weightMeasurement, setMeasurement] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(15);
  const [selectedStatus, setSelectedStatus] = useState<LuggageStatus>(
    luggage ? luggage.status : LuggageStatus.Pending
  );
  const [removalConfirmationText, setRemovalConfirmationText] = useState("");
  const getWeight = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/register-luggage/weight?flightId=${flightId}`,
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

      const weight: number = response;

      setMaxWeight(parseFloat(weight.toFixed(2)));
    } catch (error) {
      toast((error as Error).message);
    }
  };

  const registerLuggage = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/register-luggage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weight: `${weightMeasurement}`,
            status: selectedStatus,
            passengerId: passenger.id,
            ticketId: registeredTicketId,
          }),
        }
      );
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      toast.success("Luggage added");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const updateLuggage = async () => {
    try {
      if (!luggage) {
        toast.info("No luggage specified");
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/registered-luggage/${luggage.id}/update-luggage`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weight: `${weightMeasurement}`,
            status: selectedStatus,
          }),
        }
      );
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }

      toast.success("Luggage updated");
    } catch (error) {
      toast((error as Error).message);
    }
  };

  const removeLuggage = async () => {
    try {
      if (!luggage) {
        toast.info("No luggage specified");
        return;
      }
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/registered-luggage/${luggage.id}/remove-luggage`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        let errorMessage = "Something went wrong";

        try {
          const json = text ? JSON.parse(text) : null;
          errorMessage = json?.message || errorMessage;
        } catch {
          // fallback to plain text or default
          errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
      }

      toast.success("Luggage updated");
    } catch (error) {
      toast((error as Error).message);
    }
  };

  useEffect(() => {
    if (luggage?.weight) {
      setMeasurement(parseFloat(luggage.weight));
    }
  }, [luggage]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedStatus(LuggageStatus.Pending);
      setRemovalConfirmationText("");
    }
  }, [isOpen]);

  useEffect(() => {
    getWeight();
  }, []);

  const luggageStatusOptions = luggage
    ? [
        { value: LuggageStatus.Boarded, label: "Boarded" },
        { value: LuggageStatus.Lost, label: "Lost" },
        { value: LuggageStatus.Received, label: "Received" },
        { value: LuggageStatus.ToBeReceived, label: "ToBeReceived" },
        { value: LuggageStatus.Pending, label: "Pending" },
      ]
    : [{ value: LuggageStatus.Pending, label: "Pending" }];

  const measure = () => {
    const weight = parseFloat((Math.random() * maxWeight).toFixed(2));
    if (weight > maxWeight || weight < 0) {
      toast.error(`Luggage Weight must be below ${maxWeight} and above 0 kg`);
      toast.info(`Consider remeasuring`);
      return;
    }
    setMeasurement(weight);
  };

  const modalButtons = () => {
    if (!luggage) {
      return (
        <>
          <button
            className="bg-gray-400 px-4 py-2 rounded-md p-4 text-black hover:cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-900 px-4 py-2 rounded-md  text-white hover:cursor-pointer"
            onClick={handleRegister}
          >
            Register
          </button>
        </>
      );
    }

    if (removalConfirmationText === "Remove Luggage") {
      return (
        <>
          <button
            className="bg-gray-400 px-4 py-2 rounded-md  text-black hover:cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-200 px-4 py-2 rounded-md  text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-red-50"
          >
            Confirm Remove
          </button>
        </>
      );
    }

    return (
      <>
        <button
          className="bg-gray-400 px-4 py-2 rounded-md  text-black hover:cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="bg-blue-900 px-4 py-2 rounded-md  text-white hover:cursor-pointer"
          onClick={handleUpdate}
        >
          Update
        </button>
      </>
    );
  };

  const handleRegister = async () => {
    await registerLuggage();
    onConfirm();
    onClose();
  };

  const handleUpdate = async () => {
    await updateLuggage();
    onConfirm();
    onClose();
  };

  const handleRemove = async () => {
    await removeLuggage();
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;
  const headerInfo = luggage ? "Modify Luggage" : "New Luggage";

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-4">
        {/* Header */}
        <span className="text-2xl font-semibold text-gray-500">
          {headerInfo}
        </span>

        {/* Measurment */}
        <div className="flex flex-row items-center justify-between gap-2 rounded border-1 w-full border-gray-400 p-2">
          <div className="flex flex-row gap-2 p-2 items-center">
            <span>Current </span>
            <span className="rounded-lg bg-blue-200 text-blue-900 p-2">
              {weightMeasurement} kg
            </span>
          </div>

          <button
            className="rounded bg-blue-900 text-lg text-white hover:cursor-pointer p-2"
            onClick={() => measure()}
          >
            Measure
          </button>
        </div>

        <div className="flex flex-row gap-2 items-center rounded border-1 border-gray-400 p-4">
          <span>Status: </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as LuggageStatus)}
            className="rounded p-2 border border-blue-200 text-blue-900"
          >
            {luggageStatusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* removal */}
        {luggage && (
          <div className="flex flex-col gap-1 border border-red-400 p-2 rounded">
            <label className="text-sm text-gray-600">
              Type{" "}
              <span className="font-bold text-red-600">"Remove Luggage"</span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={removalConfirmationText}
              onChange={(e) => setRemovalConfirmationText(e.target.value)}
              className="border p-1 rounded"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">{modalButtons()}</div>
      </div>
    </div>
  );
};

export default LuggageRegistraionModal;
