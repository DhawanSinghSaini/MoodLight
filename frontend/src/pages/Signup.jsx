import MoodLightCard from '../components/MoodLightCard';
import SignupForm from '../components/SignupForm';
import '../styles/login.css';

export default function Signup() {
  return (
    <div className="login-page">
      <div className="login-left">
        <MoodLightCard />
      </div>
      <div className="login-right">
        <SignupForm />
      </div>
    </div>
  );
}
