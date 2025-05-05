import { useEffect, useState } from "react";
import { Gate } from "../models/flights";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GatesPages = () => {
  const [gates, setGates] = useState<Gate[]>([]);
  const { token, logOut } = useAuth();
  const navigate = useNavigate();

  const fetchGates = async () => {
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
      gates.sort((a, b) =>
        a.terminal.terminalName.localeCompare(b.terminal.terminalName)
      );

      setGates(gates);
    } catch (error) {
      toast.error((error as Error).message);
      if ((error as Error).message.includes("Unauth")) {
        logOut();
      }
    }
  };

  const handleClick = (id: number) => {
    navigate(`/gates/${id}/report`);
  };

  useEffect(() => {
    // if (triggerReport) {
    // }
    fetchGates();
  }, [token]);

  return (
    <div className="flex flex-col p-6">
      <span className="text-lg text-gray-500">Gates</span>
      <div className="flex flex-col shadow-lg rounded-xl shadow-blue-500/50 bg-blue-50 p-2 m-2">
        {gates && (
          <div className="flex flex-col gap-4">
            {gates.map((g) => (
              <div
                key={g.id}
                className="w-full flex flex-row border-10 border-blue-100 rounded-md items-start justify-between p-6"
              >
                <div className="flex flex-col ml-10 items-start justify-center">
                  <span className="text-lg text-gray-500">
                    {g.terminal.terminalName}
                  </span>
                  <span className="text-2xl text-blue-500 font-semibold">
                    Gate: {g.gateNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleClick(g.id)}
                  className="text-xl p-4 text-blue-100 font-semibold rounded bg-blue-900 hover:cursor-pointer"
                >
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GatesPages;
