import { useEffect, useState } from "react";
import { MdLocationOn, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../../auth/AuthProvider";
import { Gate, Terminal } from "../../models/flights";
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
    <div className="flex flex-col flex-1 max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
        <MdLocationOn className="mr-2" /> Terminals
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        {terminals &&
          terminals.map((t) => (
            <div
              key={t.terminalId}
              className="group hover:bg-blue-50 transition-all duration-200 border-b border-blue-100 last:border-b-0"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => handleClick(t.terminalId)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-blue-700 font-bold">
                      {t.terminalId}
                    </span>
                  </div>
                  <span className="text-lg text-gray-800 font-medium">
                    {t.terminalName}
                  </span>
                </div>
                <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-500 transition-colors">
                  <MdOutlineKeyboardArrowRight className="text-xl text-blue-500 group-hover:text-white" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TerminalList;
