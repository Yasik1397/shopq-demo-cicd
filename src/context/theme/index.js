import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    BLACK: "#061018",
    WHITE: "#FFFFFF",
    PRIMARY: "#0E1827",
    RED: "#F3456D",
    GREEN: "#2DA502",
    LIGHT_BLACK: "#0E1827",
    GREY: "#757A7E",
    LIGHT_GREY: "#A3A6A8",
    DARK_BLUE: "#0E1827",
  });

  const updateTheme = (newTheme) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...newTheme,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
ThemeProvider.propTypes = {
  children: PropTypes.node,
};
