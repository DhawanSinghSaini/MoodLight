import React from "react";
import '../styles/hamburgerbutton.css';

export default function HamburgerButton({ onClick }) {
  return (
    <div className="hamburger-container" onClick={onClick}>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
      <div className="hamburger-line"></div>
    </div>
  );
}
