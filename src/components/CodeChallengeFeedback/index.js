import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import TimeAgo from "react-timeago";
import portugueseStrings from "react-timeago/lib/language-strings/pt";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import Accordion from "@material-ui/core/Accordion";
import AccordionActions from "@material-ui/core/AccordionActions";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import SvgIcon from "@material-ui/core/SvgIcon";
import ErrorIcon from "@material-ui/icons/Error";
import LoadingResultsProgress from "../LoadingResultsProgress";
import Terminal from "../Terminal";

const formatter = buildFormatter(portugueseStrings);

const ListTabPanelBase = styled.div`
  padding: ${(props) => props.theme.spacing(3)}px;
`;

function ListTabPanel(props) {
  const { children, value, index, label, ...other } = props;

  let content;
  if (value === index) content = <List aria-label={label}>{children}</List>;

  return (
    <ListTabPanelBase
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {content}
    </ListTabPanelBase>
  );
}

ListTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.string,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PaperFillParent = styled(Paper)`
  flex-grow: 1;
`;

const BoxCenterContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SourceCode = styled(Typography)`
  && {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace !important;
    letter-spacing: 0.01em;
  }
`;

const AccordionSummaryBase = styled(AccordionSummary)`
  .MuiAccordionSummary-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function CodeChallengeFeedbackList(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expanded, setExpanded] = useState(props.expanded);

  const handleLoadButtonClick = () => {
    if (props.onLoadButtonClick) props.onLoadButtonClick(props.submission.id);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const resultIconSize = 40;
  const rotateSpinnerSize = 20;
  const loaderStrokeWeight = 3;
  let result;
  let loadButton;
  let details;
  let resultText;

  if (props.submission.id === "running") {
    result = (
      <LoadingResultsProgress
        size={rotateSpinnerSize}
        strokeWeight={loaderStrokeWeight}
      />
    );
    resultText = "Executando testes";
  } else if (props.submission.id?.toString().startsWith("error")) {
    result = (
      <SvgIcon>
        <ErrorIcon />
      </SvgIcon>
    );
    resultText = "Ocorreu um erro no servidor";
  } else {
    if (props.submission.success) {
      resultText = "Sucesso";
      result = (
        <LoadingResultsProgress
          size={rotateSpinnerSize}
          state="success"
          strokeWeight={loaderStrokeWeight}
        />
      );
    } else {
      if (props.submission.failures && props.submission.failures[0])
        resultText = props.submission.failures[0];
      else resultText = "Erro";
      result = (
        <LoadingResultsProgress
          size={rotateSpinnerSize}
          state="error"
          strokeWeight={loaderStrokeWeight}
        />
      );
    }

    loadButton = (
      <Button size="small" color="primary" onClick={handleLoadButtonClick}>
        Carregar esta submissão
      </Button>
    );
    details = (
      <AccordionDetails>
        <PaperFillParent>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            centered
          >
            <Tab label="Stacktraces" {...a11yProps(0)} />
            <Tab label="Saída no terminal" {...a11yProps(1)} />
          </Tabs>

          <ListTabPanel label="stacktraces" value={selectedTab} index={0}>
            {props.submission.stacktraces &&
              props.submission.stacktraces.map((stacktrace, idx) => (
                <ListItem key={`stacktrace-${props.submission.id}-${idx}`}>
                  <Box style={{ flexGrow: 1 }}>
                    {stacktrace.split("\n").map((line, idx2) => (
                      <SourceCode
                        component="pre"
                        key={`stacktrace-${props.submission.id}-${idx}-${idx2}`}
                      >
                        {line}
                      </SourceCode>
                    ))}
                    <Divider />
                  </Box>
                </ListItem>
              ))}
          </ListTabPanel>

          <ListTabPanel label="stdouts" value={selectedTab} index={1}>
            {props.submission.stdouts &&
              props.submission.stdouts.map((stdout, idx) => (
                <ListItem key={`stdout-${props.submission.id}-${idx}`}>
                  <Terminal
                    lines={stdout}
                    style={{ flexGrow: 1 }}
                    keyPrefix={`stacktrace-${props.submission.id}-${idx}-`}
                    getOutput={(line) => line.output}
                    getInput={(line) => line.input}
                  />
                  <Divider />
                </ListItem>
              ))}
          </ListTabPanel>
        </PaperFillParent>
      </AccordionDetails>
    );
  }

  const headerId = `feedback${props.submission.id}-header`;
  const contendId = `feedback${props.submission.id}-content`;

  return (
    <Accordion
      expanded={expanded}
      onChange={(event, isExpanded) => setExpanded(isExpanded)}
    >
      <AccordionSummaryBase
        expandIcon={<ExpandMoreIcon />}
        aria-controls={contendId}
        id={headerId}
      >
        <BoxCenterContent width={resultIconSize} height={resultIconSize}>
          {result}
        </BoxCenterContent>
        <div style={{ flexGrow: 1 }}>
          {resultText.split("\n").map((t, idx) => (
            <Typography key={`result--text--${idx}`}>{t}</Typography>
          ))}
        </div>
        <Typography style={{ marginLeft: "5px" }} color="textSecondary">
          Submissão enviada{" "}
          <TimeAgo
            date={new Date(props.submission.creation_date)}
            formatter={formatter}
          />
        </Typography>
      </AccordionSummaryBase>
      {details}
      <AccordionActions>{loadButton}</AccordionActions>
    </Accordion>
  );
}

export default CodeChallengeFeedbackList;
