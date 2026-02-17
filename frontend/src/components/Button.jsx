import '../styles/button.css';
import { IconContext } from "react-icons";

export default function Button({ children, onClick, type = "button", className = "", icon: Icon }) {
  return (
    <button className={`btn-primary ${className}`} type={type} onClick={onClick}>
      <span className="btn-text">{children}</span>
      {Icon && (
        <IconContext.Provider value={{ className: "btn-icon" }}>
          <Icon />
        </IconContext.Provider>
      )}
    </button>
  );
}

