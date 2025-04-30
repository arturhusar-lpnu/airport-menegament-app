import { Link, Outlet, useLocation } from "react-router-dom";

const TicketsBreadcrumbLayout = () => {
  const location = useLocation();

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "" && crumb !== "tickets");

  const crumbLinks = [
    { label: "Terminals", path: "/tickets" },
    ...crumbs
      .map((crumb, index) => {
        const path = `/tickets/${crumbs.slice(0, index + 1).join("/")}`;

        // Convert known keywords and values to readable labels
        let label = crumb;
        if (crumb === "terminal") return null;
        if (crumb === "gate") return null;
        if (crumb === "flight") return null;

        const prev = crumbs[index - 1];
        if (prev === "terminal") label = `Terminal ${crumb}`;
        else if (prev === "gate") label = `Gate ${crumb}`;
        else if (prev === "flight") label = `Flight ${crumb}`;

        return { label, path };
      })
      .filter(Boolean), // remove `null`s
  ];

  console.log(JSON.stringify(crumbLinks));
  return (
    <div className="p-6 bg-blue-50 w-full min-h-[calc(100vh-64px)]">
      <nav className="text-lg text-gray-500 font-medium mb-4 space-x-2">
        {crumbLinks.map((crumb, idx) => (
          <span key={idx}>
            {idx > 0 && " / "}
            <Link to={crumb!.path} className="hover:underline">
              {crumb!.label}
            </Link>
          </span>
        ))}
      </nav>
      <div className="bg-white shadow p-4 rounded">
        <Outlet />
      </div>
    </div>
  );
};

export default TicketsBreadcrumbLayout;
