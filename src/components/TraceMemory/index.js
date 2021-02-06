import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _ from "lodash";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import theme from "../../theme";

const InlineSiblingsBox = styled(Box)`
  display: "inline-flex";
`;

const CodeTextField = styled(TextField)`
  flex-grow: 1;
  .MuiInputBase-input {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace !important;
    letter-spacing: 0.01em;
    padding: 0.7em !important;
  }
  .MuiFormLabel-root {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace !important;
    letter-spacing: 0.01em;
  }
`;

const IconButtonExpandBase = styled(IconButton)`
  transform: rotate(0deg);
  margin-left: auto;
  transition: ${(props) =>
    props.theme.transitions.create("transform", {
      duration: props.theme.transitions.duration.shortest,
    })};
`;

function MemoryEntry({
  onChange,
  variableName,
  initialValue,
  errorMsg,
  readOnly,
}) {
  return (
    <InlineSiblingsBox m={1}>
      <CodeTextField
        onChange={onChange}
        label={variableName}
        defaultValue={initialValue}
        helperText={errorMsg}
        error={Boolean(errorMsg)}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: readOnly,
        }}
        variant="outlined"
      />
    </InlineSiblingsBox>
  );
}

MemoryEntry.propTypes = {
  onChange: PropTypes.func,
  variableName: PropTypes.string.isRequired,
  initialValue: PropTypes.any,
  errorMsg: PropTypes.string,
  readOnly: PropTypes.bool,
};

function MemoryBlock({
  memory,
  blockName,
  readOnly,
  onMemoryChanged,
  activateErrors,
  valueErrors,
  descendantNames,
  ...props
}) {
  // States
  const [expanded, setExpanded] = useState(true);
  const [inputErrors, setInputErrors] = useState({});

  // Effects
  useEffect(() => {
    const newInputErrors = {};
    _.entries(memory[blockName]).forEach(([varName, value]) => {
      if (!value) newInputErrors[varName] = "Não pode ser vazio";
    });
    newInputErrors !== inputErrors && setInputErrors(newInputErrors);
  }, [memory[blockName]]);

  // Handlers
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const makeMemoryChangeHandler = (varName) => {
    return (event) => {
      const value = event.target.value;

      // Update memory
      let newMemory = _.merge({}, memory, {
        [blockName]: { [varName]: value },
      });
      onMemoryChanged && onMemoryChanged(newMemory, blockName, varName, value);
    };
  };

  // Constants
  const varNames = _.keys(memory[blockName]).sort();
  const name = _.last(_.split(blockName, ","));
  const hasChildren = !_.isEmpty(descendantNames);
  const varErrors = _.merge({}, valueErrors, { [blockName]: inputErrors });
  const activateError = activateErrors[blockName];

  // Components
  let action;
  if (hasChildren)
    action = (
      <IconButtonExpandBase
        style={expanded && { transform: "rotate(180deg)" }}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="mostrar mais"
      >
        <ExpandMoreIcon />
      </IconButtonExpandBase>
    );

  return (
    <Card
      style={{
        flexGrow: 1,
        backgroundColor:
          readOnly || hasChildren ? theme.colors.DISABLED : "white",
      }}
      elevation={3}
    >
      <CardHeader
        title={name === "<module>" ? "Programa" : name}
        subheader={
          activateError && (
            <Typography color="error" variant="body2">
              {activateError}
            </Typography>
          )
        }
        action={action}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {varNames.map((varName) => {
            const error = _.hasIn(varErrors, `${blockName}.${varName}`)
              ? varErrors[blockName][varName]
              : "";

            return (
              <MemoryEntry
                key={`${blockName}-${varName}`}
                variableName={varName}
                onChange={makeMemoryChangeHandler(varName)}
                initialValue={memory[blockName][varName]}
                readOnly={readOnly || hasChildren}
                errorMsg={error}
              />
            );
          })}
        </CardContent>
      </Collapse>
      {hasChildren && (
        <CardContent>
          {!expanded && hasChildren && <MoreHorizIcon />}
          <MemoryBlock
            memory={memory}
            blockName={descendantNames[0]}
            readOnly={readOnly}
            onMemoryChanged={onMemoryChanged}
            activateErrors={activateErrors}
            valueErrors={valueErrors}
            descendantNames={_.slice(descendantNames, 1)}
            {...props}
          />
        </CardContent>
      )}
    </Card>
  );
}

MemoryBlock.propTypes = {
  memory: PropTypes.object.isRequired,
  blockName: PropTypes.string,
  readOnly: PropTypes.bool,
  onMemoryChanged: PropTypes.func,
  activateErrors: PropTypes.object,
  valueErrors: PropTypes.object,
  descendantNames: PropTypes.arrayOf(PropTypes.string),
};

MemoryBlock.defaultProps = {
  descendantNames: [],
};

function TraceMemory({
  memory,
  readOnly,
  activateErrors,
  valueErrors,
  onMemoryChanged,
  ...props
}) {
  // Constants
  const names = _.keys(memory);
  names.sort();

  return (
    <MemoryBlock
      memory={memory}
      blockName={names[0]}
      readOnly={readOnly}
      onMemoryChanged={onMemoryChanged}
      activateErrors={activateErrors}
      valueErrors={valueErrors}
      descendantNames={_.slice(names, 1)}
      {...props}
    />
  );
}

TraceMemory.propTypes = {
  memory: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  activateErrors: PropTypes.object,
  valueErrors: PropTypes.object,
  onMemoryChanged: PropTypes.func,
};

TraceMemory.defaultProps = {
  activateErrors: {},
  valueErrors: {},
  readOnly: false,
};

export default TraceMemory;
