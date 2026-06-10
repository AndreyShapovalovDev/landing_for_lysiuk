import ClientCursor from "@/components/ClientCursor";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import MusicPlayer from "@/components/MusicPlayer";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";

import TimelineSection from "@/components/TimelineSection";
import LocationSection from "@/components/LocationSection";
import CountdownSection from "@/components/CountdownSection";
import DressCodeSection from "@/components/DressCodeSection";
import RsvpSection from "@/components/RsvpSection";
import FinalSection from "@/components/FinalSection";

export default function Home() {
  return (
    <>
      <ClientCursor />
      <ScrollProgressBar />
      <LoadingScreen />
      <MusicPlayer />
      <NavBar />
      <main>
        <HeroSection />
        <TimelineSection />
        <LocationSection />
        <CountdownSection />
        <DressCodeSection />
        <RsvpSection />
        <FinalSection />
      </main>
    </>
  );
}
