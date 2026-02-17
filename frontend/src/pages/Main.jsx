import { useState } from "react";
import Streak from "../components/Streak";
import Sidebar from "../components/Sidebar";
import HamburgerButton from "../components/HamburgerButton";
import Breathe from "../feature/Breathe";
import Timer from "../feature/Timer";
import '../styles/main.css';
import SetGoal from "../feature/SetGoal";
import Activity from "../feature/Activity";
import Journal from "../feature/Journal";
import Soundscape from "../feature/SoundScape";
import Insight from "../feature/Insight";
import FeelingPage from "../feature/FeelingPage";

export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("Feeling Page"); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (selected) {
      case "Journal": return <Journal />;
      case "Breathe": return <Breathe />;
      case "Soundscape": return <Soundscape />;
      case "SetGoal": return <SetGoal />;
      case "Activity": return <Activity />;
      case "Timer": return <Timer />;
      case "Insight": return <Insight />;
      default: return <FeelingPage />;
    }
  };

  return (
    <div className="main-page">
      {/* Hamburger visible only on small screens */}
      <div className="hamburger-wrapper">
        <HamburgerButton onClick={toggleSidebar} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onSelect={setSelected} />
      </div>

      {/* Middle Content Area */}
      <div className="content-wrapper">
        {renderContent()}
      </div>

      {/* Right Streak Pane */}
      <div className="streak-wrapper">
        <Streak />
      </div>
    </div>
  );
}
