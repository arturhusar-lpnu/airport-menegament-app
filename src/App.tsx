import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
// import AuthProvider from "./auth/AuthProvider";
import FlightsPage from "./pages/FlightsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import "react-datepicker/dist/react-datepicker.css";
import FlightPage from "./pages/FlightPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./auth/PrivateRoute";
import BuyTicketPage from "./pages/BuyTicketPage";
import TicketsBreadcrumbLayout from "./layouts/TicketsBreadcrumbLayout";
import TerminalList from "./pages/Ticket Registration/TerminalList";
import GateList from "./pages/Ticket Registration/GateList";
import FlightList from "./pages/Ticket Registration/FlightList";
import TicketList from "./pages/Ticket Registration/TicketList";
import GatesPages from "./pages/GatesPages";
import GateReportPage from "./pages/GateReportPage";
import StatsPage from "./pages/StatsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/flights" element={<FlightsPage />} />
      <Route path="/flights/flight/:id" element={<FlightPage />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="/tickets/:flightId/buy-ticket"
          element={<BuyTicketPage />}
        />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/gates" element={<GatesPages />} />
        <Route path="/gates/:gateId/report" element={<GateReportPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<TicketsBreadcrumbLayout />}>
          <Route path="/tickets" element={<TerminalList />} />
          <Route path="/tickets/terminal/:terminalId" element={<GateList />} />
          <Route
            path="/tickets/terminal/:terminalId/gate/:gateId"
            element={<FlightList />}
          />
          <Route
            path="/tickets/terminal/:terminalId/gate/:gateId/flight/:flightId"
            element={<TicketList />}
          />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="stats/" element={<StatsPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
