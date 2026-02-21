import { Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title: string;
}

export const RecentActivity = ({ activities, title }: RecentActivityProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex justify-between items-center">
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          Latest
        </span>
      </div>

      <div className="divide-y divide-border">
        {activities.length > 0 ? (
          activities.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={12} />
                {item.date}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
};
