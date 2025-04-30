import { forwardRef } from "react";
import { MdDateRange } from "react-icons/md";

interface FlightsDateInputProps {
  value?: string;
  onClick?: () => void;
}

const FlightsDateInput = forwardRef<HTMLDivElement, FlightsDateInputProps>(
  ({ value, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="border p-4 flex items-center justify-between w-64 cursor-pointer"
    >
      <div>
        <p className="text-gray-500 text-sm">Pick a date</p>
        <p className="text-lg">
          {value && value !== "Invalid Date" ? value : "Select date"}
        </p>
      </div>
      <MdDateRange size={24} className="text-blue-800" />
    </div>
  )
);

export default FlightsDateInput;
