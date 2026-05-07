import Allposts from "../components/Allposts";
import Suggestions from "../components/Suggestions";
import TopContributor from "../components/TopContributor";


function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        
        <div className="flex flex-col gap-6 min-w-0">
          <TopContributor />
          <Allposts />
        </div>

        <div className="hidden lg:block">
          <Suggestions />
        </div>

      </div>
    </div>
  </div>
  );
}

export default HomePage;
