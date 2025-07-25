import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import Home from "../../pages/home/Home";
import UserDashboard from "../../pages/userDashboard/UserDashboard";
// All other page imports are removed

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
            // All other routes are removed.
            // We can add a Pet Details page route here later.
            // Example: { path: '/pet/:id', element: <PetDetailsPage /> }
        ]
    }
]);

export default router;