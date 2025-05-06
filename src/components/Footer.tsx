const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Text on the right */}
        <div className="text-sm md:text-base flex flex-col gap-2 font-medium">
          <span className="text-md">LembAir</span>
          <span className="text-sm">Lemberg International Airport</span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://leafletjs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://leafletjs.com/docs/images/logo.png"
              alt="Leaflet"
              className="h-8 filter invert"
            />
          </a>
          {/* WeatherAPI */}
          <a
            href="https://www.weatherapi.com/"
            title="Free Weather API"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.weatherapi.com/v4/images/weatherapi_logo.png"
              alt="Weather data by WeatherAPI.com"
              className="h-8 filter invert"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
