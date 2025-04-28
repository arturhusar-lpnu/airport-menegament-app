import { forwardRef } from "react";
import { FaClock } from "react-icons/fa";

const FlightsTimeInput = forwardRef<HTMLDivElement, any>(
  ({ value, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="border p-4 flex items-center justify-between w-64 cursor-pointer"
    >
      <div>
        <p className="text-gray-500 text-sm">Flights from</p>
        <p className="text-lg">{value ? value : "Select time"}</p>
      </div>
      <FaClock size={24} className="text-blue-800" />
    </div>
  )
);

export default FlightsTimeInput;
