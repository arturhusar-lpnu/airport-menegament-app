import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";
import { parseISO, format } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LuggageMonthData {
  weight: string;
  luggage_count: string;
  month: string;
}

interface ChartEntry {
  month: string;
  weight: number;
  count: number;
}

const LuggageChart = () => {
  const { token } = useAuth();
  const [chartData, setChartData] = useState<ChartEntry[]>([]);

  const groupDataByMonth = (data: LuggageMonthData[]): ChartEntry[] => {
    const grouped: Record<string, { weight: number; count: number }> = {};

    data.forEach((item) => {
      console.log(item);
      const key = format(parseISO(item.month), "yyyy-MM");
      if (!grouped[key]) {
        grouped[key] = { weight: 0, count: 0 };
      }
      grouped[key].weight += parseFloat(item.weight);
      grouped[key].count += parseFloat(item.luggage_count);
    });

    return Object.keys(grouped)
      .sort()
      .map((month) => ({
        month,
        weight: grouped[month].weight,
        count: grouped[month].count,
      }));
  };

  const fetchLuggageData = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/stats/luggages-per-month",
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

      const data: LuggageMonthData[] = response;
      setChartData(groupDataByMonth(data));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLuggageData();
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl max-w-fit bg-gradient-to-br from-blue-950 to-blue-700 shadow-lg">
      <span className="text-2xl text-white font-bold tracking-wide">
        Luggages Per Month
      </span>
      <div className="bg-white rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width={700} height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip
              contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
              itemStyle={{ color: "#333" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#00bcd4"
              fill="#00bcd4"
              dot={{ stroke: "#00bcd4", strokeWidth: 2 }}
              name="Weight (kg)"
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ff4081"
              dot={{ stroke: "#ff4081", strokeWidth: 2 }}
              name="Luggage Count"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LuggageChart;
