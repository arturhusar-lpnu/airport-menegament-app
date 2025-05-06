import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";

// Define the structure of your input data
interface TicketsData {
  count: string;
  date: string;
  seat_class: string;
}

// Define the structure of the grouped data
interface GroupedData {
  date: string;
  economy: number;
  business: number;
}

const BestBuyings = () => {
  const { token } = useAuth();
  const [chartData, setChartData] = useState<GroupedData[]>([]);

  // Group data by date
  const groupData = (data: TicketsData[]): GroupedData[] => {
    const grouped = data.reduce<Record<string, GroupedData>>((acc, curr) => {
      const date = new Date(curr.date).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = { date, economy: 0, business: 0 };
      }

      if (curr.seat_class === "economy" || curr.seat_class === "business") {
        acc[date][curr.seat_class] += parseInt(curr.count);
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  // Fetch the ticket buying data
  const fetchBuyings = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/stats/top-buyings",
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

      const data: TicketsData[] = response;
      const groupedData = groupData(data); // Group the data
      // Sort and get top 3 days based on total ticket count
      const sortedData = groupedData
        .map((item) => ({
          ...item,
          total: item.economy + item.business,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      setChartData(sortedData); // Set the top 3 data to chartData
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchBuyings();
  }, [token]);

  return (
    <div className="p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Top 3 Best Buying Days</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map((data, index) => (
          <div key={index} className="card p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{data.date}</h3>
            <div className="mt-2">
              <p>
                <span className="font-medium">Economy:</span> {data.economy}
              </p>
              <p>
                <span className="font-medium">Business:</span> {data.business}
              </p>
              <p className="mt-2">
                <span className="font-bold">Total Tickets:</span>{" "}
                {data.economy + data.business}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestBuyings;
