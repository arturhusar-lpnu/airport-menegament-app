import { useEffect, useState } from "react";
import { Gate } from "../models/flights";
import { useAuth } from "../auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { toast } from "react-toastify";
import { useParams } from "react-router";

const GatesPages = () => {
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
    <div className="flex flex-col shadow-lg rounded-xl shadow-blue-500/50 bg-blue-50">
      {gates && (
        <div>
          {gates.map((g) => (
            <div
              key={g.id}
              className="w-full flex flex-row border-b-10 border-b-blue-100 items-start justify-between p-6"
            >
              <span className="text-2xl text-blue-500 font-semibold">
                {g.gateNumber}
              </span>
              <MdOutlineKeyboardArrowRight
                className="text-4xl hover:cursor-pointer text-blue-500"
                onClick={() => handleClick(g.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GatesPages;
