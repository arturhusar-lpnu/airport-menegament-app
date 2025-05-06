import { IoIosAirplane } from "react-icons/io";
import { Hero } from "../components/Hero";
import WeatherIcon from "../components/WeatherIcon";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleToFlights = () => {
    navigate("/flights");
  };

  return (
    <section
      className="relative w-full flex items-center justify-center bg-blue-100"
      style={{ height: "calc(100vh - 161px)" }}
    >
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/images/background.png"
        alt="flights"
      />

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 flex flex-row items-center justify-center max-w-7xl px-6 space-x-10">
        <Hero className="text-center text-white" />

        <div className="w-px h-64 bg-white opacity-50" />

        <div className="flex flex-col items-center gap-4 text-white">
          <span className="text-2xl font-semibold">Lemberg</span>
          <WeatherIcon size={64} color="#FFFFFF" />
          <button
            onClick={handleToFlights}
            className="flex items-center gap-3  border cursor-pointer border-white px-4 py-2 rounded-md text-white font-semibold hover:bg-white/20 transition"
          >
            <span>To Flights</span>
            <IoIosAirplane size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
