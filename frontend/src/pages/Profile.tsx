import Header from "../components/profile/ProfileHeader";
import Info from "../components/profile/Info";
import NavigationTabs from "../components/sections/NavigationTabs";
import FilterBar from "../components/sections/FilterBar";
import Footer from "../components/layout/BottomNav";
import ActivityFeed from "../components/sections/ActivityFeed";

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Info />

      <div className="px-6 mt-8 border-b border-gray-200">
        <NavigationTabs />
      </div>

      <div className="relative px-6 h-10">
        <FilterBar />
      </div>

      <div
        className="flex-1 flex pb-10"
        style={{
          backgroundImage: "url('/activity-feed-background.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 20%",
          backgroundSize: "90%",
        }}
      >
        <ActivityFeed />
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-10 z-50">
        <Footer />
      </div>
    </div>
  );
}
