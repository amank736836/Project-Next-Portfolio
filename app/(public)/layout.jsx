import Navbar from "@/components/Navbar/Navbar";
import Themes from "@/components/Themes/Themes";
import ScrollHandler from "@/components/ScrollHandler";
import TransitionLoader from "@/components/TransitionLoader";
import RootShell from "@/components/RootShell";
import "./Home.css";

export default function PublicLayout({ children }) {
  return (
    <RootShell>
      <Navbar />
      <Themes />
      <ScrollHandler />
      <TransitionLoader />
      {children}
    </RootShell>
  );
}