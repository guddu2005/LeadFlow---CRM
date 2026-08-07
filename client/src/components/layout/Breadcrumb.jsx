import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    const nameMap = {
        dashboard: "Dashboard",
        leads: "Leads Pipeline",
        prospects: "Prospects",
        companies: "Companies",
        contacts: "Contacts CRM",
        outreach: "Outreach Campaigns",
        interviews: "Interviews",
        analytics: "Analytics & Reports",
        templates: "Message Templates",
        reports: "Reports Export",
        settings: "Settings",
    };

    return (
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
                to="/dashboard"
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
            </Link>

            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                const displayName = nameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <React.Fragment key={to}>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                        {isLast ? (
                            <span className="font-bold text-slate-900 dark:text-white">
                                {displayName}
                            </span>
                        ) : (
                            <Link
                                to={to}
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
