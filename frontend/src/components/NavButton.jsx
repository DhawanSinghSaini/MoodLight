import React from "react";
import '../styles/navbutton.css';

export default function NavButton({ text = "Button", onClick }) {
  return (
    <button className="nav-button" onClick={onClick}>
      <p>{text}</p>
    </button>
  );
}
