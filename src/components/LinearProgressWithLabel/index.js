import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 3px;
  background-color: #d3e4f1;
  margin-bottom: 0.5rem;
`;

const Filler = styled.div`
  position: relative;
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
  border-radius: inherit;
  text-align: right;
`;

const BackgroundFiller = styled(Filler)`
  position: absolute;
`;

const Label = styled.span`
  font-size: 0.8rem;
  padding: 0.3rem;
  color: ${(props) => (props.percentage > 10 ? "white" : "black")};
`;

export default function LinearProgressWithLabel({
  value,
  intermediateValue,
  maxValue,
}) {
  const percentage = (100 * value) / maxValue;
  return (
    <BarContainer>
      <BackgroundFiller
        color="#a8c9e3"
        percentage={(100 * intermediateValue) / maxValue}
      />
      <Filler color="#3677ac" percentage={percentage}>
        <Label percentage={percentage}>
          {value}/{maxValue}
        </Label>
      </Filler>
    </BarContainer>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  intermediateValue: PropTypes.number,
  maxValue: PropTypes.number.isRequired,
};
