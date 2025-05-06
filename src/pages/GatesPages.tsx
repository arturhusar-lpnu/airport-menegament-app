import { useEffect, useState } from "react";
import { Gate, GateWorkload } from "../models/flights";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GatesPages = () => {
  const [gates, setGates] = useState<Gate[]>([]);
  const { token, logOut } = useAuth();
  const [gatesWorkload, setGatesWorkload] = useState<GateWorkload[]>([]);
  const navigate = useNavigate();

  const fetchGatesWorkload = async () => {
    try {
      const today = new Date().toDateString();

      const res = await fetch(
        `http://localhost:3000/api/v1/stats/gates/workloads?date=${today}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();

      if (response.message)
        throw new Error(`Error fetching terminals ${response.message}`);

      const gateWorkloads: GateWorkload[] = response;
      const current = gateWorkloads.filter(
        (gt) => new Date(gt.date).toDateString() === today
      );
      setGatesWorkload(current);
      // const gateWorkloads: GateWorkload[] = response;
      // const current = gateWorkloads.filter(
      //   (gt) => new Date(gt.date).toDateString() === today
      // );
      // setGatesWorkload(gateWorkloads);
    } catch (error) {
      toast.error((error as Error).message);
      if ((error as Error).message.includes("Unauth")) {
        logOut();
      }
    }
  };

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
    fetchGates();
    fetchGatesWorkload();
  }, [token]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 p-6 bg-white">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Gates Overview
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gates.map((g) => (
            <div
              key={g.id}
              className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 border border-blue-100 flex flex-col justify-between"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-500">Terminal</p>
                <h2 className="text-xl font-semibold text-blue-700">
                  {g.terminal.terminalName}
                </h2>
                <div className="flex flex-row items-center justify-between">
                  <p className="mt-2 text-lg font-medium text-gray-800">
                    Gate: <span className="text-blue-600">{g.gateNumber}</span>
                  </p>
                  <span className="rounded-xl p-4 bg-blue-50">
                    {gatesWorkload.find((gW) => gW.gateId == g.id)
                      ? `${
                          gatesWorkload.find((gW) => gW.gateId == g.id)
                            ?.workloadPercent
                        } % load`
                      : "0 % load"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClick(g.id)}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GatesPages;
