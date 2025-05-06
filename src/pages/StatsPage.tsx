import { useState } from "react";
import AirportMap from "../components/Stats/TopAirportsMap";
import LuggageChart from "../components/Stats/LuggageChart";
import UserRolesCard from "../components/Stats/UserRolesCard";
import FlightsMonthStats from "../components/Stats/FlightsMonthStats";
// import BestBuyings from "../components/Stats/BetsBuyings";
// import other stats components if needed

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState("stats");

  const renderContent = () => {
    switch (activeTab) {
      case "stats":
        return (
          <div className="p-4 space-y-6 flex flex-col">
            <div className="flex flex-row gap-4 p-4">
              <div className="flex flex-row gap-2">
                <div className="w-lg h-fit">
                  <UserRolesCard />
                </div>
              </div>
              <LuggageChart />
            </div>
            <FlightsMonthStats />
          </div>
        );
      case "map":
        return <AirportMap />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-blue-50">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 font-medium ${
            activeTab === "stats"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Airport Stats
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-4 py-2 font-medium ${
            activeTab === "map"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Flights Map
        </button>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
};

export default StatsPage;
