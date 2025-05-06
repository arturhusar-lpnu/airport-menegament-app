import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthProvider";
import Spinner from "../Spinner";
import {
  MdFilterAlt,
  MdFlight,
  MdInfo,
  MdLocationOn,
  MdRefresh,
} from "react-icons/md";
interface AirportData {
  flights: string;
  airport_name: string;
  latitude: string;
  longitude: string;
}

function AirportMap() {
  const [airports, setAirports] = useState<AirportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState<number>(0);
  const { token } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/stats/top-airports",
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

      const airports: AirportData[] = response;

      setAirports(airports);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate the center of the map based on all airports
  const getMapCenter = (): [number, number] => {
    if (airports.length === 0) return [0, 0];

    let totalLat = 0;
    let totalLng = 0;

    airports.forEach((airport) => {
      totalLat += parseFloat(airport.latitude);
      totalLng += parseFloat(airport.longitude);
    });

    return [totalLat / airports.length, totalLng / airports.length];
  };

  // Function to determine marker size based on number of flights
  const getMarkerSize = (flightsNum: number) => {
    return flightsNum * 10000; // Scale factor for circle size
  };

  // Function to determine marker color based on number of flights
  const getMarkerColor = (flightsNum: number) => {
    if (flightsNum >= 5) return "#ff0000"; // Red for 5+ flights
    if (flightsNum >= 3) return "#ff6600"; // Orange for 3-4 flights
    if (flightsNum >= 2) return "#ffcc00"; // Yellow for 2 flights
    return "#0066ff"; // Blue for 1 flight
  };

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  const filteredAirports =
    filterValue > 0
      ? airports.filter((airport) => parseInt(airport.flights) >= filterValue)
      : airports;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white mr-4">
              <MdFlight className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-blue-800">
              Global Airport Map with Flight Frequency
            </h1>
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterValue}
                onChange={(e) => setFilterValue(parseInt(e.target.value))}
              >
                <option value="0">All airports</option>
                <option value="1">1+ flights</option>
                <option value="2">2+ flights</option>
                <option value="3">3+ flights</option>
                <option value="5">5+ flights</option>
              </select>
              <MdFilterAlt className="absolute right-3 top-2.5 text-gray-500" />
            </div>

            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <MdRefresh className="mr-1" /> Refresh
            </button>
          </div>
        </div>

        {/* Map Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-2">
                <MdInfo />
                <span>Showing {filteredAirports.length} airports</span>
              </div>
              <div className="text-sm">
                Most flights:{" "}
                {airports.length > 0
                  ? Math.max(...airports.map((a) => parseInt(a.flights)))
                  : 0}
              </div>
            </div>
          </div>

          {/* Legend and Map Container */}
          <div className="relative">
            {/* Legend */}
            <div className="absolute top-4 right-4 z-20 bg-white p-4 rounded-lg shadow-md border border-gray-100">
              <div className="text-sm font-bold mb-2 flex items-center">
                <MdLocationOn className="mr-1 text-blue-600" />
                Flight Frequency
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                  <span className="text-sm">5+ flights</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm">3-4 flights</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">2 flights</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">1 flight</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-[70vh]">
              <MapContainer
                center={getMapCenter()}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredAirports.map((airport, index) => (
                  <div key={index}>
                    <Circle
                      center={[
                        parseFloat(airport.latitude),
                        parseFloat(airport.longitude),
                      ]}
                      radius={getMarkerSize(parseInt(airport.flights))}
                      pathOptions={{
                        fillColor: getMarkerColor(parseInt(airport.flights)),
                        fillOpacity: 0.6,
                        weight: 1,
                        color: getMarkerColor(parseInt(airport.flights)),
                      }}
                    />
                    <Marker
                      position={[
                        parseFloat(airport.latitude),
                        parseFloat(airport.longitude),
                      ]}
                    >
                      <Popup className="airport-popup">
                        <div className="text-center">
                          <h3 className="font-bold text-blue-700 mb-1">
                            {airport.airport_name}
                          </h3>
                          <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 inline-block mb-2">
                            <span className="font-bold">{airport.flights}</span>{" "}
                            flights
                          </div>
                          <div className="text-xs text-gray-500">
                            {airport.latitude}, {airport.longitude}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Footer with summary */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Airports</div>
                <div className="text-2xl font-bold text-blue-700">
                  {airports.length}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">
                  Airports with 3+ Flights
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {airports.filter((a) => parseInt(a.flights) >= 3).length}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Busiest Airport</div>
                <div className="text-lg font-bold text-blue-700 truncate">
                  {airports.length > 0
                    ? airports.sort(
                        (a, b) => parseInt(b.flights) - parseInt(a.flights)
                      )[0].airport_name
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Airport List Preview (Optional) */}
        <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-700 text-white font-medium">
            Top Airports by Flight Frequency
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Airport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flights
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {airports
                  .sort((a, b) => parseInt(b.flights) - parseInt(a.flights))
                  .slice(0, 5)
                  .map((airport, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {airport.airport_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {airport.flights}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {airport.latitude}, {airport.longitude}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="w-full h-full relative p-4">
  //     <div className="mb-4 bg-white p-4 rounded shadow-md inline-block">
  //       <div className="text-sm font-bold mb-2">Flight Frequency</div>
  //       <div className="flex items-center mb-1">
  //         <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
  //         <span className="text-xs">5+ flights</span>
  //       </div>
  //       <div className="flex items-center mb-1">
  //         <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
  //         <span className="text-xs">3-4 flights</span>
  //       </div>
  //       <div className="flex items-center mb-1">
  //         <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
  //         <span className="text-xs">2 flights</span>
  //       </div>
  //       <div className="flex items-center">
  //         <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
  //         <span className="text-xs">1 flight</span>
  //       </div>
  //     </div>

  //     <div className="w-full h-[75vh]">
  //       <MapContainer
  //         center={getMapCenter()}
  //         zoom={2}
  //         style={{ height: "100%", width: "100%" }}
  //       >
  //         <TileLayer
  //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //         />

  //         {airports.map((airport, index) => (
  //           <div key={index}>
  //             <Circle
  //               center={[
  //                 parseFloat(airport.latitude),
  //                 parseFloat(airport.longitude),
  //               ]}
  //               radius={getMarkerSize(parseInt(airport.flights))}
  //               pathOptions={{
  //                 fillColor: getMarkerColor(parseInt(airport.flights)),
  //                 fillOpacity: 0.6,
  //                 weight: 1,
  //                 color: getMarkerColor(parseInt(airport.flights)),
  //               }}
  //             />
  //             <Marker
  //               position={[
  //                 parseFloat(airport.latitude),
  //                 parseFloat(airport.longitude),
  //               ]}
  //             >
  //               <Popup>
  //                 <div>
  //                   <strong>{airport.airport_name}</strong>
  //                   <br />
  //                   Flights: {airport.flights}
  //                   <br />
  //                   Coordinates: {airport.latitude}, {airport.longitude}
  //                 </div>
  //               </Popup>
  //             </Marker>
  //           </div>
  //         ))}
  //       </MapContainer>
  //     </div>
  //   </div>
  // );
}

export default AirportMap;
