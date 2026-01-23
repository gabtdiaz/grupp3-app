import Header from "../components/profile/Header";
import Info from "../components/profile/Info";
import NavigationTabs from "../components/profile/NavigationTabs";
import FilterBar from "../components/profile/FilterBar";
import Footer from "../components/profile/Footer";
import ActivityFeed from "../components/profile/ActivityFeed";

export default function Profile() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Info />
      <NavigationTabs />
      <FilterBar />
      <ActivityFeed />
      <Footer />
    </div>
  );
}
