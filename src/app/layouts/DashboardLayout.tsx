
import { LayoutDashboard, FolderKanban, Users, MessageSquareQuote, LogOut } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Admin panel er sidebar links
    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", path: "/dashboard/projects", icon: FolderKanban },
        { name: "Team", path: "/dashboard/team", icon: Users },
        { name: "Testimonials", path: "/dashboard/testimonials", icon: MessageSquareQuote },
    ];

    return (
        <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden flex-col justify-between md:flex">
                <div>
                    <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar-primary">
                        <h2 className="text-xl font-bold text-sidebar-primary-foreground tracking-wide">
                            Creative Hub
                        </h2>
                    </div>
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors ${
                                        isActive 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Logout Button */}
                <div className="p-4 border-t border-sidebar-border">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sidebar-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative">
                {/* Topbar */}
                <header className="h-16 border-b border-border bg-background flex items-center px-8 z-10">
                    <h1 className="text-xl font-semibold capitalize text-foreground">
                        {location.pathname.split('/').pop() || 'Dashboard'}
                    </h1>
                </header>
                
                {/* Dynamic Content (Outlet) */}
                <div className="flex-1 overflow-auto bg-background p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;