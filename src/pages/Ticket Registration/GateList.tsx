import { useEffect, useState } from "react";
import { Gate } from "../../models/flights";
import { useAuth } from "../../auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { MdLocationOn, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { toast } from "react-toastify";
import { useParams } from "react-router";

const GateList = () => {
  const [gates, setGates] = useState<Gate[]>();
  const location = useLocation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { terminalId } = useParams();

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/gates", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      if (response.message)
        throw new Error(`Error fetching terminals ${response.message}`);

      let gates: Gate[] = response;
      gates = gates.filter(
        (g) => g.terminal.terminalId == parseInt(terminalId!)
      );
      setGates(gates);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClick = (id: number) => {
    navigate(`${location.pathname}/gate/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
        <MdLocationOn className="mr-2" /> Gates
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        {gates &&
          gates.map((g) => (
            <div
              key={g.id}
              className="group hover:bg-blue-50 transition-all duration-200 border-b border-blue-100 last:border-b-0"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => handleClick(g.id)}
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{g.id}</span>
                  </div>
                  <span className="text-xl text-gray-800 font-medium">
                    Gate: {g.gateNumber}
                  </span>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <span className="text-xl text-gray-800 font-medium">
                    {g.flights.length} flights
                  </span>
                  <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-500 transition-colors">
                    <MdOutlineKeyboardArrowRight className="text-2xl text-blue-500 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GateList;
