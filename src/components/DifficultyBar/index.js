import React from "react";
import styled from "styled-components";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";

const GreenDifficultyIcon = styled(FitnessCenterIcon)`
  color: ${(props) => props.theme.colors.SUCCESS};
`;

const YellowDifficultyIcon = styled(FitnessCenterIcon)`
  color: ${(props) => props.theme.colors.WARNING};
`;

const RedDifficultyIcon = styled(FitnessCenterIcon)`
  color: ${(props) => props.theme.colors.DANGER};
`;

const PurpleDifficultyIcon = styled(FitnessCenterIcon)`
  color: #971df5;
`;

const BlackDifficultyIcon = styled(FitnessCenterIcon)`
  color: black;
`;

export default function DifficultyBar({ difficulty }) {
  if (difficulty <= 1) return <GreenDifficultyIcon />;
  if (difficulty == 2)
    return (
      <>
        <YellowDifficultyIcon />
        <YellowDifficultyIcon />
      </>
    );
  if (difficulty == 3)
    return (
      <>
        <RedDifficultyIcon />
        <RedDifficultyIcon />
        <RedDifficultyIcon />
      </>
    );
  if (difficulty == 4)
    return (
      <>
        <PurpleDifficultyIcon />
        <PurpleDifficultyIcon />
        <PurpleDifficultyIcon />
        <PurpleDifficultyIcon />
      </>
    );
  else {
    const icons = [];
    for (let i = 0; i < difficulty; i++)
      icons.push(<BlackDifficultyIcon key={`diff__icon__${i}`} />);
    return <>{icons}</>;
  }
}
