import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import ProjectsManage from "../pages/Projects/ProjectsManage";
import Login from "../pages/Auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "projects",
            element: <ProjectsManage />,
          },
          {
            path: "team",
            element: <div>Team Management</div>,
          },
          {
            path: "testimonials",
            element: <div>Testimonials Management</div>, // Placeholder
          },
        ],
      },
    ],
  },
]);

export default router;
