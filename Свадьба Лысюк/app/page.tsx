import ClientCursor from "@/components/ClientCursor";
import LoadingScreen from "@/components/LoadingScreen";
import MusicPlayer from "@/components/MusicPlayer";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import StickyScrollSection from "@/components/StickyScrollSection";
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
      <LoadingScreen />
      <MusicPlayer />
      <NavBar />
      <main>
        <HeroSection />
        <StickyScrollSection />
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
