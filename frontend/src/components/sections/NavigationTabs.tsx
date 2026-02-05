import { useState } from "react";

const tabs = ["SKAPADE", "KOMMER", "TIDIGARE"];

export default function NavigationTabs() {
  const [activeTab, setActiveTab] = useState("SKAPADE");

  return (
    <div className="flex justify-between">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-xs tracking-wide transition-colors
            ${activeTab === tab ? "border-b  " : "text-gray-500"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
