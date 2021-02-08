import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import _ from "lodash";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Alert from "../../src/components/Alert";
import TraceMemory from "../../src/components/TraceMemory";
import Terminal from "../../src/components/Terminal";
import LoadingResultsProgress from "../../src/components/LoadingResultsProgress";
import StaticCodeHighlight from "../../src/components/StaticCodeHighlight";
import { findLinesWithCode } from "../../src/models/trace";
import { traceMessages as m } from "../../src/messages";
import {
  getChallenge,
  postTrace,
  getTraceStateList,
  getContentLists,
} from "../../src/client";

const LoadingContainer = styled.div`
  margin: 8em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const GridItem = styled(Grid)`
  padding-left: ${(props) => props.theme.spacing(3)}px;
  padding-right: ${(props) => props.theme.spacing(3)}px;
`;

const GridItemFullHeight = styled(GridItem)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const CodePaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const FlexBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const CodeTextField = styled(TextField)`
  flex-grow: 1;
  .MuiInputBase-input {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace !important;
    letter-spacing: 0.01em;
    padding: 0.7em !important;
  }
`;

const MobileStepperBase = styled(MobileStepper)`
  position: fixed;
  bottom: 0;
  width: 100%;
  ${(props) => props.theme.breakpoints.up("sm")} {
    width: calc(
      100% - ${(props) => props.theme.drawerWidth}px - 2 *
        ${(props) => props.theme.spacing(3)}px
    );
  } ;
`;

function TraceChallenge({ slug, trace, stateList, linesWithCode }) {
  const terminalRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passedTests, setPassedTests] = useState(false);
  const [currentStateIndex, setCurrentStateIndex] = useState(
    stateList.states.length - 1
  );
  const [nextLine, setNextLine] = useState(null);
  const [retval, setRetval] = useState();
  const [currentMemory, setCurrentMemory] = useState({});

  // Error messages
  const [memoryErrorMsg, setMemoryErrorMsg] = useState("");
  const [memoryActivateErrors, setMemoryActivateErrors] = useState();
  const [memoryValueErrors, setMemoryValueErrors] = useState();
  const [nextLineErrorMsg, setNextLineErrorMsg] = useState("");
  const [retvalErrorMsg, setRetvalErrorMsg] = useState("");
  const [terminalErrorMsg, setTerminalErrorMsg] = useState("");
  const [hasEmptyMemory, setHasEmptyMemory] = useState(false);

  const router = useRouter();

  const { states, totalStates, latestState: latestStateIndex } = stateList;

  const updateNextLine = (curIdx, states) => {
    const nextState =
      states && states.length > curIdx + 1 ? states[curIdx + 1] : {};
    if (typeof nextState.line_i === "number") setNextLine(nextState.line_i + 1);
    else setNextLine(null);
  };

  useEffect(() => {
    setCurrentStateIndex(states.length - 1);
  }, [states.length]);

  useEffect(() => updateNextLine(currentStateIndex, states), [states.length]);

  const stateEditable = currentStateIndex === latestStateIndex + 1;

  const isLast = totalStates > 0 && currentStateIndex >= totalStates;
  const idx = isLast ? totalStates - 1 : currentStateIndex;
  const currentState = states && states.length > idx ? states[idx] : {};
  const nextState = states && states.length > idx + 1 ? states[idx + 1] : {};
  const hasNextState = idx + 1 < totalStates;
  const linesSelectable =
    Object.entries(nextState).length === 0 && hasNextState;
  const prevState =
    states && states.length > 0 && idx > 0 ? states[idx - 1] : {};

  const lineContainsReturn = (line) =>
    _.first(_.split(_.trim(line, " "))).startsWith("return");
  let hasReturn = false;
  let hadReturn = false;
  let currentRetval = "";
  if (lineContainsReturn(currentState.line)) {
    currentRetval = currentState.retval === null ? "" : currentState.retval;
    hasReturn = true;
  } else if (lineContainsReturn(prevState.line)) {
    currentRetval = prevState.retval === null ? "" : prevState.retval;
    hadReturn = true;
  }

  const stdout = currentState.stdout ? currentState.stdout : [];

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const replaceMessages = (errors) => {
    let replaced = {};
    _.entries(errors).forEach(([name, ctx]) => {
      if (typeof ctx === "number") {
        replaced[name] = m(ctx);
      } else {
        replaced[name] = {};
        _.entries(ctx).forEach(([varName, errCode]) => {
          replaced[name][varName] = m(errCode);
        });
      }
    });
    return replaced;
  };

  const handleNext = () => {
    if (stateEditable) {
      const curRetVal = hasReturn ? retval : null;
      postTrace(
        slug,
        currentStateIndex,
        currentMemory,
        (terminalRef.current && terminalRef.current.value) || "",
        currentStateIndex < totalStates - 1 ? nextLine : null,
        curRetVal
      )
        .then((result) => {
          setMemoryErrorMsg(m(result.memory_code.code));
          setMemoryActivateErrors(
            replaceMessages(result.memory_code.activate_errors)
          );
          setMemoryValueErrors(
            replaceMessages(result.memory_code.value_errors)
          );
          setNextLineErrorMsg(m(result.next_line_code));
          setRetvalErrorMsg(m(result.retval_code));
          setTerminalErrorMsg(m(result.terminal_code));

          const passedAll =
            result.memory_code.code === 0 &&
            result.next_line_code === 0 &&
            result.retval_code === 0 &&
            result.terminal_code === 0;
          if (passedAll) {
            router.replace(router.asPath);
          }
          setPassedTests(passedAll);
          setSnackbarOpen(true);
        })
        .catch(console.error);
    } else {
      const newIdx = Math.min(totalStates, currentStateIndex + 1);
      setCurrentStateIndex(newIdx);
      updateNextLine(newIdx, states);
    }
  };

  const handleBack = () => {
    const newIdx = Math.max(0, currentStateIndex - 1);
    setCurrentStateIndex(newIdx);
    updateNextLine(newIdx, states);
  };

  const handleMemoryChanged = (memory, blockName, varName, value) => {
    setCurrentMemory(memory);

    const hasEmptyEntries = _.values(memory).some((block) =>
      _.values(block).some((value) => !value)
    );
    setHasEmptyMemory(hasEmptyEntries);

    if (memoryValueErrors && blockName in memoryValueErrors) {
      const newErrors = {};
      _.entries(memoryValueErrors).forEach(([block, vars]) => {
        if (block === blockName) {
          let otherKeys = _.keys(vars);
          _.remove(otherKeys, (k) => k === varName);
          newErrors[block] = _.pick(vars, otherKeys);
        } else newErrors[block] = vars;
      });
      setMemoryValueErrors(newErrors);
    }
  };

  const handleRetvalChange = (event) => {
    setRetvalErrorMsg("");
    setRetval(event.target.value);
  };

  useEffect(() => {
    setCurrentMemory(
      currentState.name_dicts ? currentState.name_dicts : { "<module>": {} }
    );
  }, [currentState]);

  const marginBottom = 10;

  if (!trace)
    return (
      <LoadingContainer>
        <CircularProgress color="secondary" size="10vw" />
      </LoadingContainer>
    );

  return (
    <>
      <Grid container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={passedTests ? "success" : "error"}
          >
            {passedTests
              ? "Passou em todos os testes"
              : "Falhou em algum teste"}
            !
          </Alert>
        </Snackbar>

        <GridItem item sm={12}>
          <Box mb={3}>
            <Typography variant="h2" component="h1" gutterBottom={true}>
              {trace.title}
            </Typography>
            <Typography>
              Qual será o estado do programa depois que a linha a seguir for
              executada? Atualize a memória e saída no terminal e selecione a
              próxima linha que será executada pelo interpretador do Python.
            </Typography>
          </Box>
        </GridItem>

        <GridItem item md={6}>
          <Box mb={marginBottom}>
            <Typography variant="h3">Código</Typography>
            <CodePaper elevation={3}>
              {trace.code && (
                <StaticCodeHighlight
                  style={vs}
                  highlightLinesPrimary={
                    typeof currentState.line_i === "number"
                      ? [currentState.line_i + 1]
                      : []
                  }
                  highlightLinesSecondary={
                    typeof currentState.call_line_i === "number"
                      ? [currentState.call_line_i + 1]
                      : []
                  }
                  highlightLineNumbers={nextLine ? [nextLine] : []}
                  clickableLines={linesSelectable ? linesWithCode : []}
                  onClick={(line) => {
                    setNextLine(line);
                    setNextLineErrorMsg("");
                  }}
                >
                  {trace.code}
                </StaticCodeHighlight>
              )}
            </CodePaper>
          </Box>
        </GridItem>

        <GridItemFullHeight container item md={6}>
          <Box mb={marginBottom}>
            {isLast ? (
              <LoadingContainer>
                <LoadingResultsProgress size={200} state="success" />
              </LoadingContainer>
            ) : (
              <>
                <Typography variant="h3">Memória</Typography>
                {memoryErrorMsg && (
                  <Typography color="error" variant="body2">
                    {memoryErrorMsg}
                  </Typography>
                )}
                <TraceMemory
                  memory={currentMemory}
                  activateErrors={memoryActivateErrors}
                  valueErrors={memoryValueErrors}
                  onMemoryChanged={handleMemoryChanged}
                  onHasEmptyFieldsChanged={setHasEmptyMemory}
                  readOnly={!stateEditable}
                />

                {(hasReturn || hadReturn) && (
                  <FlexBox mt={2}>
                    <CodeTextField
                      id="retval"
                      style={{ flexGrow: 1 }}
                      onChange={handleRetvalChange}
                      label={"Valor de retorno"}
                      helperText={
                        retvalErrorMsg
                          ? retvalErrorMsg
                          : "Digite o valor retornado pela função (deixe em branco se nada foi retornado)"
                      }
                      variant="outlined"
                      defaultValue={currentRetval}
                      error={Boolean(retvalErrorMsg)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: !stateEditable || !hasReturn,
                      }}
                    />
                  </FlexBox>
                )}

                <FlexBox mt={2} minHeight="10em">
                  <Typography variant="h3">Terminal</Typography>
                  {terminalErrorMsg && (
                    <Typography color="error" variant="body2">
                      {terminalErrorMsg}
                    </Typography>
                  )}
                  <Terminal
                    lines={stdout}
                    style={{ flexGrow: 1 }}
                    ref={terminalRef}
                    getOutput={(line) => line.out}
                    getInput={(line) => line.in}
                    editable={stateEditable}
                  />
                </FlexBox>

                {currentStateIndex < totalStates - 1 && (
                  <FlexBox mt={2}>
                    <Typography variant="h3">Próxima linha</Typography>
                    {nextLineErrorMsg && (
                      <Typography color="error" variant="body2">
                        {nextLineErrorMsg}
                      </Typography>
                    )}
                    <CodeTextField
                      error={_.isNil(nextLine)}
                      id="next-line"
                      value={nextLine !== null ? nextLine : ""}
                      helperText={
                        nextLine !== null
                          ? ""
                          : "Clique no código para selecionar a próxima linha a ser executada pelo interpretador Python"
                      }
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FlexBox>
                )}
              </>
            )}
          </Box>
        </GridItemFullHeight>
      </Grid>

      <MobileStepperBase
        variant="progress"
        steps={totalStates + 1}
        position="static"
        LinearProgressProps={{ style: { flexGrow: 1 } }}
        activeStep={currentStateIndex}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={
              currentStateIndex >= totalStates ||
              hasEmptyMemory ||
              (hasNextState && !nextLine)
            }
          >
            Próximo
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={currentStateIndex === 0}
          >
            <KeyboardArrowLeft />
            Anterior
          </Button>
        }
      />
    </>
  );
}

export default TraceChallenge;

export async function getServerSideProps(context) {
  const slug = context.query.slug;
  const session = await getSession({ req: context.req });

  if (!session) {
    context.res.writeHead(302, {
      Location: `/login?callbackUrl=/teste-de-mesa/${slug}`,
    });
    context.res.end();
    return;
  }

  const [trace, stateList, contentLists] = await Promise.all([
    getChallenge(session, "trace", slug),
    getTraceStateList(session, slug),
    getContentLists(session),
  ]);

  const linesWithCode = findLinesWithCode(trace.code);

  return {
    props: {
      slug,
      trace,
      stateList,
      linesWithCode,
      contentLists,
    },
  };
}
