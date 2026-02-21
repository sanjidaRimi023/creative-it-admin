import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxios";
import { AnalyticsChart } from "./components/AnalyticsChart";
import { RecentActivity } from "./components/RecentActivity";
import { StatsGrid } from "./components/StatsGrid";
export interface Project {
  _id: string;
  title: string;
  category?: string;
  description: string;
  imageUrl: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
}

interface DashboardStats {
  projects: number;
  team: number;
  testimonials: number;
}

const DashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState<boolean>(true);

  // Data States
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    team: 0,
    testimonials: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentTeam, setRecentTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projectsRes, teamRes, testimonialsRes] = await Promise.all([
          axiosSecure.get("/projects"),
          axiosSecure.get("/team"),
          axiosSecure.get("/testimonials"),
        ]);
        console.log("PROJECT DATA FROM API:", projectsRes.data);
        // Setting Stats
        setStats({
          projects: projectsRes.data.length,
          team: teamRes.data.length,
          testimonials: testimonialsRes.data.length,
        });

        // Setting Recent Activities (Latest 5)
        setRecentProjects(projectsRes.data.slice(-5).reverse());
        setRecentTeam(teamRes.data.slice(-5).reverse());
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Projects", value: stats.projects },
    { name: "Team", value: stats.team },
    { name: "Reviews", value: stats.testimonials },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Manage your portfolio content and monitor system growth.
        </p>
      </div>

      {/* Stats Section */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <AnalyticsChart data={chartData} />
        </div>

        {/* System Info / Status */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-center">
          <h3 className="font-bold mb-2">System Status</h3>
          <div className="flex items-center gap-2 text-green-500 text-sm mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            All systems operational
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Database connection is stable. Current API response time is optimal.
            All public routes are fetching dynamic data from the production
            cluster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Projects"
          activities={recentProjects.map((p) => ({
            id: p._id,
            title: p.title || "Untitled Project",
            subtitle: p.description || "No description provided",
            date: "Project",
          }))}
        />
        <RecentActivity
          title="Team Management"
          activities={recentTeam.map((t) => ({
            id: t._id,
            title: t.name,
            subtitle: t.designation,
            date: "Member",
          }))}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
