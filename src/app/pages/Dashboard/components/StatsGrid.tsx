import {
  ArrowRight,
  FolderKanban,
  MessageSquareQuote,
  Users,
} from "lucide-react";
import { Link } from "react-router";

interface DashboardStats {
  projects: number;
  team: number;
  testimonials: number;
}

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statItems = [
    {
      title: "Projects",
      count: stats.projects,
      icon: FolderKanban,
      link: "/dashboard/projects",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    },
    {
      title: "Team Members",
      count: stats.team,
      icon: Users,
      link: "/dashboard/team",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
    },
    {
      title: "Testimonials",
      count: stats.testimonials,
      icon: MessageSquareQuote,
      link: "/dashboard/testimonials",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item) => (
        <div
          key={item.title}
          className="bg-card rounded-xl border border-border p-5 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>
              <h3 className="text-2xl font-bold mt-1">{item.count}</h3>
            </div>
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon size={20} />
            </div>
          </div>
          <Link
            to={item.link}
            className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline"
          >
            Manage {item.title} <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </div>
  );
};
