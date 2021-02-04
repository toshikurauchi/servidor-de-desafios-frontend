import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const colors = {
  BLUE1: "#4b8bbe",
  BLUE2: "#306998",
  YELLOW1: "#ffe873",
  YELLOW2: "#ffd43b",
  GRAY1: "#646464",
  GRAY2: "#e0e0e0",
  DISABLED: "#cccccc",
  TERMINAL_INPUT: "#27e427",
  SUCCESS: "#39c27c",
  SUCCESS_BACKGROUND: "rgba(0,200,83,.1)",
  DANGER: "#ff1744",
  DANGER_BACKGROUND: "rgba(255,23,68,.1)",
  INFO: "#448aff",
  INFO_BACKGROUND: "rgba(68,138,255,.1)",
  EXERCISE: "#651fff",
  EXERCISE_BACKGROUND: "rgba(101,31,255,.1)",
};

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: colors.BLUE2,
        light: colors.BLUE1,
      },
      secondary: {
        main: colors.YELLOW2,
        light: colors.YELLOW1,
      },
    },
    typography: {
      fontSize: 12,
    },
    colors: colors,
  })
);
export default theme;
