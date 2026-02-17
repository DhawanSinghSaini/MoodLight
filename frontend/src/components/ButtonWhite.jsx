import '../styles/button-white.css';
import { IconContext } from "react-icons";

export default function ButtonWhite({ children, onClick, type = "button", className = "", icon: Icon }) {
  return (
    <button className={`btn-white ${className}`} type={type} onClick={onClick}>
      <span className="btn-text">{children}</span>
      {Icon && (
        <IconContext.Provider value={{ className: "btn-icon" }}>
          <Icon />
        </IconContext.Provider>
      )}
    </button>
  );
}
