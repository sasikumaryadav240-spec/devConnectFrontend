import Allposts from "../components/Allposts";
import Suggestions from "../components/Suggestions";
import TopContributor from "../components/TopContributor";


function HomePage() {
  return (
    <div>
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="p-12 flex flex-row gap-8">
        <div className="flex-1 basis-2/3 flex flex-col gap-6 min-w-0">
          <TopContributor/>
          <Allposts/>
        </div>
        <div className="hidden md:block basis-1/3">
          <Suggestions/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
