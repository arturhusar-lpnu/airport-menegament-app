import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/flights" element={<FlightsPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/flights/flight/:id" element={<FlightPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route
          path="/tickets/:flightId/buy-ticket"
          element={<BuyTicketPage />}
        />
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
