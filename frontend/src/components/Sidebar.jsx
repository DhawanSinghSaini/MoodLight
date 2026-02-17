import '../styles/sidebar.css';
import H2 from './H2';
import NavButton from './NavButton';

export default function Sidebar({ onSelect }) {
  return (
    <div className="sidebar-moodlight-card">
      <H2>MoodLight</H2>
      <div className="nav-buttons">
        <NavButton text='Journal' onClick={() => onSelect("Journal")} />
        <NavButton text='Breathe' onClick={() => onSelect("Breathe")} />
        <NavButton text='SoundScape' onClick={() => onSelect("Soundscape")} />
        <NavButton text='Set Goal' onClick={() => onSelect("SetGoal")} />
        <NavButton text='Activity' onClick={() => onSelect("Activity")} />
        <NavButton text='Timer' onClick={() => onSelect("Timer")} />
        <NavButton text='Insights' onClick={() => onSelect("Insight")} />
      </div>
    </div>
  );
}
