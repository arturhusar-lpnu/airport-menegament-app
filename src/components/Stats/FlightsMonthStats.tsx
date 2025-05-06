import { useEffect, useState } from "react";
import {
  Rectangle,
  Tooltip,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";

interface MonthlyStat {
  yearMonth: string;
  totalFlights: number;
  landedFlights: number;
  delayedFlights: number;
  cancelledFlights: number;
}

const FlightsMonthStats = () => {
  const { token } = useAuth();
  const [flightData, setFlightData] = useState<MonthlyStat[]>([]);

  const fetchFlightStat = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/stats/monthly-flight-status",
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

      const data: MonthlyStat[] = response;
      console.log(data);
      setFlightData(data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchFlightStat();
  }, [token]);

  return (
    <div className="h-[400px] flex flex-col gap-2">
      <span>Flights Stats Per Month</span>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={flightData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearMonth" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="totalFlights"
            fill="#4b91f1"
            activeBar={<Rectangle fill="#6ea8fe" stroke="#1c64f2" />}
          />
          <Bar
            dataKey="landedFlights"
            fill="#34c38f"
            activeBar={<Rectangle fill="#59dcb3" stroke="#219f79" />}
          />
          <Bar
            dataKey="delayedFlights"
            fill="#f4c430"
            activeBar={<Rectangle fill="#f8d14e" stroke="#c99800" />}
          />
          <Bar
            dataKey="cancelledFlights"
            fill="#f46a6a"
            activeBar={<Rectangle fill="#f78c8c" stroke="#c53030" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlightsMonthStats;
