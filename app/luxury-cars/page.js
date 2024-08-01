import AboutLuxuryCarSection from "../Components/luxuryPage/AboutLuxuryCarSection";
import CollactionLuxuryCarSection from "../Components/luxuryPage/CollactionLuxuryCarSection";
import PopularLuxuryCarSection from "../Components/luxuryPage/PopularLuxuryCarSection";
import WelcomeSection from "../Components/luxuryPage/WelcomeSection";

function page() {
  return (
    <div>
      <WelcomeSection />
      <AboutLuxuryCarSection />
      <PopularLuxuryCarSection />
      <CollactionLuxuryCarSection />
    </div>
  );
}

export default page;
