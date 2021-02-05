import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const TerminalTextArea = styled.textarea`
  padding: 0;
  background-color: black;
  border: none;
  color: white;
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 1rem;
  letter-spacing: 0.01em;
  line-height: 1.5;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const TerminalBase = styled(Box)`
  background-color: black;
  color: white;
  padding: ${(props) => props.theme.spacing(2)}px;
  width: 100%;
`;

const SourceCode = styled(Typography)`
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace !important;
  letter-spacing: 0.01em;
`;

const TerminalInput = styled(SourceCode)`
  color: ${(props) => props.theme.colors.TERMINAL_INPUT};
`;

function Terminal({
  keyPrefix,
  getInput,
  getOutput,
  lines,
  onChange,
  editable,
  ...props
}) {
  const handleChange = (event) => {
    onChange && onChange(event.target.value);
  };

  return (
    <TerminalBase {...props}>
      {lines.map((line, idx) => (
        <Box key={`${keyPrefix}${idx}`}>
          <SourceCode component="code">{getOutput(line)}</SourceCode>
          <TerminalInput component="code">{getInput(line)}</TerminalInput>
        </Box>
      ))}
      {editable && (
        <Box>
          <TerminalTextArea rows="3" onChange={handleChange}></TerminalTextArea>
        </Box>
      )}
    </TerminalBase>
  );
}

Terminal.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyPrefix: PropTypes.string,
  getOutput: PropTypes.func.isRequired,
  getInput: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  editable: PropTypes.bool,
};

Terminal.defaultProps = {
  keyPrefix: "",
  editable: true,
};

export default Terminal;
