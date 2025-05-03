import { useParams } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useState } from "react";
import { FaRegCalendarTimes } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  registeredTicketId: number;
  onRemoved: () => void;
};

const RemoveRegistrationModal = ({
  isOpen,
  onClose,
  registeredTicketId,
  onRemoved,
}: Props) => {
  const { gateId } = useParams();
  const [isRemoveButtonDisabled, setButtonDisabled] = useState(true);

  const { token } = useAuth();

  const checkRemove = (input: string) => {
    if (input == "Remove") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  };

  const removeRegistration = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/gates/${gateId}/registered-ticket/${registeredTicketId}/remove-ticket`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ticketId: registeredTicketId }),
        }
      );

      if (!res.ok) {
        let errorMessage = "Unknown error";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      onRemoved();
      onClose();
      toast.success("Registration Removed");
    } catch (error) {
      toast.error("Failed to remove registration " + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-4xl font-bold text-red-600 mb-6">
          Remove Registration
        </h3>

        {/* Passenger Selection */}
        <div className="mb-6 flex flex-col gap-4">
          <label className="block mb-2 text-md font-semibold text-gray-700">
            Are You sure you want to remove registration?
          </label>
          <label className="block mb-2 text-sm font-semibold text-gray-500">
            Type "Remove" to remove the registraion
          </label>

          <div className="relative mb-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <FaRegCalendarTimes />
              <input
                type="text"
                placeholder="Remove"
                className="flex-1 bg-transparent outline-none"
                onChange={(e) => checkRemove(e.target.value)}
              />
            </div>
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
            onClick={removeRegistration}
            disabled={isRemoveButtonDisabled}
            className={`px-4 py-2 rounded-lg text-white
                ${
                  isRemoveButtonDisabled
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveRegistrationModal;
