import React, { useState, useEffect } from "react";
import "./DarkMode.scss";

const DarkModeToggle = () => {
  // Check local storage for the initial dark mode state
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  // Update local storage when the dark mode state changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <button class="darkModeBtn" onClick={toggleDarkMode}>
        {darkMode ? (
          <div class="sun visible"></div>
        ) : (
          <div class="moon visible">
            <div class="star"></div>
            <div class="star small"></div>
          </div>
        )}
      </button>
      {/* <button className="darkModeBtn" onClick={toggleDarkMode}>
        {darkMode ? <BsFillSunFill /> : <BsFillMoonFill />}
      </button> */}
    </>
  );
};

export default DarkModeToggle;
