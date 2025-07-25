import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Home from "../../pages/home/Home";
import BatchMint from "../BatchMint";
import UserDashboard from "../../pages/userDashboard/UserDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/mint",
        element: <BatchMint />,
      },
      {
        path: "/userdashboard",
        element: <UserDashboard />,
      },
    ],
  },
]);

export default router; 