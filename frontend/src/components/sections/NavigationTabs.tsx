interface NavigationTabsProps {
  activeTab: "SKAPADE" | "KOMMER" | "TIDIGARE";
  onTabChange: (tab: "SKAPADE" | "KOMMER" | "TIDIGARE") => void;
}

export default function NavigationTabs({
  activeTab,
  onTabChange,
}: NavigationTabsProps) {
  const tabs = [
    { value: "SKAPADE" as const },
    { value: "KOMMER" as const },
    { value: "TIDIGARE" as const },
  ];

  return (
    <div className="flex justify-between">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`pb-3 text-xs tracking-wide transition-colors
            ${activeTab === tab.value ? "border-b  " : "text-gray-500"}`}
        >
          {tab.value}
        </button>
      ))}
    </div>
  );
}
