import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import MainLayout from "./layouts/MainLayout";
// import AuthProvider from "./auth/AuthProvider";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        // <AuthProvider>
        <MainLayout />
        // </AuthProvider>
      }
    >
      <Route index element={<HomePage />} />
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
