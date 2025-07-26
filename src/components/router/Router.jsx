import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/home/Home";
import UserDashboard from "../../pages/userDashboard/UserDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App></App>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/userdashboard',
                element: <UserDashboard></UserDashboard>
            }
            // The route for '/interact' is removed.
        ]
    }
]);

export default router;