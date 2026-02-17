import MoodLightCard from '../components/MoodLightCard';
import LoginForm from '../components/LoginForm';
import '../styles/login.css';

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-left">
        <MoodLightCard />
      </div>
      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
}
