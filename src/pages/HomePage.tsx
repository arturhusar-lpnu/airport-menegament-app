import { IoIosAirplane } from "react-icons/io";
import { Hero } from "../components/Hero";
import WeatherIcon from "../components/WeatherIcon";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const handleToFlights = () => {
    navigate("/flights");
  };

  return (
    <section className="flex flex-col w-full items-center justify-center min-h-[calc(100vh-64px)] bg-blue-100 py-2">
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/images/background.png"
        alt="flights"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-row items-center justify-center max-w-10xl space-x-10">
        <Hero className="text-center" />
        <div className="w-px h-64 bg-white opacity-50" />
        <div className="flex flex-col gap-4">
          <span className="text-white text-2xl">Lemberg</span>
          <WeatherIcon size={64} color="#FFFFFF" />
          <div
            className="flex flex-rows gap-4 items-center justify-center bg-transparent outline-1 outline-white rounded-md w-40 p-4 hover:cursor-pointer z-20"
            onClick={handleToFlights}
          >
            <span className="text-white font-semibold">To Flights</span>
            <IoIosAirplane size={35} color="white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
