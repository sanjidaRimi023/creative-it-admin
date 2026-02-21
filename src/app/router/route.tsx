import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import ProjectsManage from "../pages/Dashboard/Projects/ProjectsManage";
import TeamManage from "../pages/Dashboard/Teams/TeamManage";
import TestimonialManage from "../pages/Dashboard/Testimonials/TestimonialManage";

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
            element: <TeamManage />,
          },
          {
            path: "testimonials",
            element: <TestimonialManage />,
          },
        ],
      },
    ],
  },
]);

export default router;
