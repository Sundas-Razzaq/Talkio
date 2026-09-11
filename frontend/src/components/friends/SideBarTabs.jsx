const SidebarTabs = ({ activeTab, onChange, requestCount }) => {
    const tabs = [
        { id: "chats", label: "Chats" },
        { id: "friends", label: "Friends" },
        {
            id: "requests",
            label: "Requests",
            badge: requestCount > 0 ? requestCount : null,
        },
    ];

    return (
        <nav className="sidebar-tabs" aria-label="Sidebar sections">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={
                        "sidebar-tabs__tab" +
                        (activeTab === tab.id
                            ? " sidebar-tabs__tab--active"
                            : "")
                    }
                    onClick={() => onChange(tab.id)}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                >
                    <span className="sidebar-tabs__label">
                        {tab.label}
                    </span>

                    {tab.badge !== null && (
                        <span className="sidebar-tabs__badge">
                            {tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>
    );
};

export default SidebarTabs;