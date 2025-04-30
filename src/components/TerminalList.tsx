import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../auth/AuthProvider";
import { Gate, Terminal } from "../models/flights";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TerminalList = () => {
  const [terminals, setTerminals] = useState<Terminal[]>();
  const { token } = useAuth();
  const navigate = useNavigate();

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

      const data: Gate[] = response;

      const gateTerminals = Array.from(
        new Map(data.map((g) => [g.terminal.terminalId, g.terminal])).values()
      );

      setTerminals(gateTerminals);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleClick = (id: number) => {
    navigate(`/tickets/terminal/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col gap-10 shadow-lg rounded-xl shadow-blue-500/50 bg-blue-50">
      {terminals && (
        <div>
          {terminals.map((t) => (
            <div
              key={t.terminalId}
              className="w-full flex flex-row border-b-10 border-b-blue-100 items-start justify-between p-6"
            >
              <span className="text-xl text-blue-500 font-semibold">
                {t.terminalName}
              </span>
              <MdOutlineKeyboardArrowRight
                className="text-2xl hover:cursor-pointer text-blue-500"
                onClick={() => handleClick(t.terminalId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TerminalList;
