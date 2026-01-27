import Header from "../components/activity/ActivityHeader";
import NavigationTabs from "../components/sections/NavigationTabs";
import FilterBar from "../components/sections/FilterBar";
import ActivityFeed from "../components/sections/ActivityFeed";
import BottomNav from "../components/layout/BottomNav";

export default function Activity() {
  const isEmpty = false;

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="relative h-56"
        style={{
          backgroundImage: `url("/activity-header-background.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "26rem",
        }}
      >
        <Header />
      </div>

      <div className="px-6 pt-3 border-b border-gray-200 relative">
        <NavigationTabs />
      </div>

      <div className="relative px-6 h-10">
        <FilterBar />
      </div>

      <div
        className={`flex-1 flex pb-10 ${isEmpty ? "" : "bg-white"}`}
        style={
          isEmpty
            ? {
                backgroundImage: "url('/activity-feed-background.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 20%",
                backgroundSize: "90%",
              }
            : undefined
        }
      >
        <ActivityFeed />
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
