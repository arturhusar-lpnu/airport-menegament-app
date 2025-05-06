import { useState } from "react";
import { FilterFlightQuery, FlightType } from "../models/flights";
import FlightsTable from "../components/FlightsTable";
import { FaClock, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { datepickerModifiers } from "../utils/DatePickerPopupConfig";
import { MdDateRange } from "react-icons/md";
import { GiAirplaneArrival, GiAirplaneDeparture } from "react-icons/gi";

const FlightsPage = () => {
  const [activeTab, setActiveTab] = useState(FlightType.Arriving);
  const [type, setType] = useState<FlightType>(FlightType.Arriving);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [searchName, setSearchName] = useState<string>("");
  const [triggerFetch, setTriggerFetch] = useState<boolean>(true);

  const tabs = [
    {
      type: FlightType.Arriving,
      label: "Arriving",
      icon: <GiAirplaneArrival size={40} />,
    },
    {
      type: FlightType.Departing,
      label: "Departing",
      icon: <GiAirplaneDeparture size={40} />,
    },
  ];
  const handleSearch = () => {
    setTriggerFetch(true);
  };

  const query = new FilterFlightQuery();

  query.type = type;

  if (selectedDate && selectedTime) {
    query.scheduleTimeFrom = new Date(
      selectedDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds(),
        selectedTime.getMilliseconds()
      )
    );
  }

  query.searchName = searchName;

  return (
    <section className="flex flex-col overflow-hidden relative items-center justify-center min-h-[calc(100vh-64px)] max-h-screen bg-gradient-to-r from-blue-500 to-gray-300">
      <img
        className="absolute inset-0 w-full h-[50vh] object-cover z-0"
        src="/images/arrivals.png"
        alt="flights"
      />
      <div className="absolute inset-0 h-[50vh] bg-black/60 z-10" />

      <div className="relative container m-auto max-w-5xl px-6 py-8 z-20">
        <div className="bg-white px-6 py-8 mb-6 rounded-xl shadow-lg border">
          {/* Tabs */}
          <div className="flex justify-center space-x-8 border-b-2 pb-4 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.type}
                className={`flex flex-row items-center justify-center gap-3 px-6 py-2 font-semibold text-lg rounded-md hover:bg-blue-100 hover:text-blue-500 transition-all duration-300 ${
                  activeTab === tab.type
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setActiveTab(tab.type);
                  setTriggerFetch(true);
                  setType(tab.type);
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="mb-6">
            <span className="text-2xl font-semibold text-gray-700">
              {type === FlightType.Arriving ? "Arriving" : "Departing"} Flights
            </span>
          </div>

          {/* Date and Time Pickers */}
          <div className="flex items-center justify-between gap-6 mb-8">
            <div className="flex items-center justify-between w-64 p-4 border rounded-xl shadow-md bg-white">
              <div>
                <p className="text-gray-500 text-sm">Pick a date</p>
                <p className="text-lg font-medium">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Select date"}
                </p>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                popperModifiers={datepickerModifiers}
                popperPlacement="right"
                customInput={
                  <MdDateRange
                    size={24}
                    className="text-blue-800 cursor-pointer"
                  />
                }
                dateFormat="dd MMM yyyy"
              />
            </div>
            <div className="flex items-center justify-between w-64 p-4 border rounded-xl shadow-md bg-white relative">
              <div>
                <p className="text-gray-500 text-sm">Pick a time</p>
                <p className="text-lg font-medium">
                  {selectedTime
                    ? selectedTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Select time"}
                </p>
              </div>
              <DatePicker
                selected={selectedTime}
                onChange={(date) => setSelectedTime(date)}
                popperModifiers={datepickerModifiers}
                popperPlacement="right"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                customInput={
                  <FaClock size={24} className="text-blue-800 cursor-pointer" />
                }
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center border-b mb-8 py-2 gap-4">
            <div className="flex flex-row w-full items-center">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by flight name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition duration-300"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {/* Flights Table */}
          <div className="overflow-y-auto max-h-[calc(100vh-450px)]">
            <FlightsTable
              type={type}
              query={query}
              triggerFetch={triggerFetch}
              setTrigerFetch={setTriggerFetch}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightsPage;
