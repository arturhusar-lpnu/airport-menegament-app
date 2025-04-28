import { useState } from "react";
import { FlightType } from "../models/flights";
import FlightsTable from "../components/FlightsTable";
import { FaClock, FaSearch } from "react-icons/fa";
import { useAuth } from "../auth/AuthProvider";
import LoginButton from "../components/LoginButton";
import DatePicker from "react-datepicker";
// import { MdDateRange } from "react-icons/md";
import { datepickerModifiers } from "../utils/DatePickerPopupConfig";
import { MdDateRange } from "react-icons/md";
// import FlightsDateInput from "../components/FlightsDateInput";
// import FlightsTimeInput from "../components/FlightsTimeInput";

const FlightsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(FlightType.Arriving);
  const [type, setType] = useState<FlightType>(FlightType.Arriving);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [searchName, setSearchName] = useState<string>("");
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  // const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const tabs = [
    { type: FlightType.Arriving, label: "Arriving" },
    { type: FlightType.Departing, label: "Departing" },
  ];
  const handleSearch = () => {
    setTriggerFetch(true); // Trigger fetch when button is clicked
  };

  // const handleDatePickerToggle = () => {
  //   // e.stopPropagation();
  //   console.log("Date picker called");
  //   setIsDatePickerOpen((prev) => !prev);
  // };
  // const handleTimePickerToggle = () => {
  //   console.log("Time picker called");
  //   setIsTimePickerOpen((prev) => !prev);
  // };

  return (
    <section className="flex flex-col items-center ustify-center min-h-[calc(100vh-64px)] bg-blue-50">
      {user ? (
        <div className="container m-auto max-w-4xl px-4 md:px-0">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border md:m-0">
            {/* Tabs */}
            <div className="flex justify-center space-x-8 border-b-2 pb-4 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.type}
                  className={`px-4 py-2 font-semibold text-lg ${
                    activeTab === tab.type
                      ? "border-b-2 border-blue-300 text-blue-300"
                      : "text-gray-500 hover:text-blue-300"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.type);
                    setType(tab.type);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="mb-6">
              <span className="text-xl font-semibold">
                {type === FlightType.Arriving ? "Arriving" : "Departing"}{" "}
                Flights
              </span>
            </div>

            {/*Date and Time Pickers*/}
            <div className="flex items-center justify-center gap-4">
              <div className="border p-4 flex items-center justify-between w-64">
                <div>
                  <p className="text-gray-500 text-sm">Pick a date</p>
                  <p className="text-lg">
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
                  // minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                />
              </div>
              {/* <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }}
                open={isDatePickerOpen}
                onClickOutside={() => setIsDatePickerOpen(false)}
                onSelect={() => setIsDatePickerOpen(false)}
                popperModifiers={datepickerModifiers}
                onInputClick={handleDatePickerToggle}
                customInput={
                  <FlightsDateInput onClick={() => ()} />
                }
                dateFormat="dd MMM yyyy"
              /> */}
              <div className="border p-4 flex items-center justify-between w-64 relative">
                <div>
                  <p className="text-gray-500 text-sm">Flights from</p>
                  <p className="text-lg">
                    {selectedTime
                      ? selectedTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select time"}
                  </p>
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedTime(date)}
                  popperModifiers={datepickerModifiers}
                  popperPlacement="right"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  customInput={
                    <FaClock
                      size={24}
                      className="text-blue-800 cursor-pointer"
                    />
                  }
                />
              </div>
              {/* <DatePicker
                selected={selectedTime}
                onChange={(date) => {
                  setSelectedTime(date);
                  setIsTimePickerOpen(false);
                }}
                open={isTimePickerOpen}
                onClickOutside={() => setIsTimePickerOpen(false)}
                onSelect={() => setIsTimePickerOpen(false)}
                popperModifiers={datepickerModifiers}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                customInput={
                  <FlightsTimeInput onClick={handleTimePickerToggle} />
                }
              /> */}
            </div>
            {/* Search Bar */}

            <div className="flex border-b mb-6 py-2 gap-4">
              <div className="flex flex-row w-full items-center">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <button
                className="text-white whitespace-nowrap bg-blue-500 hover:bg-blue-700 hover:text-blue-100 rounded-md px-3 py-2 cursor-pointer"
                onClick={handleSearch}
              >
                <span>Search Flights</span>
              </button>
            </div>

            {/* Flights Table */}
            <div>
              <FlightsTable
                type={type}
                query={{ type }}
                triggerFetch={triggerFetch}
                setTrigerFetch={setTriggerFetch}
              />
              {/* {" "} */}
              {/* Pass query if needed */}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2>Login First</h2>
          <LoginButton />
        </>
      )}
    </section>
  );
};

export default FlightsPage;
