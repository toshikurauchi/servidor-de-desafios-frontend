import React, { useState, useEffect, useRef } from "react";
import { getSession, useSession } from "next-auth/client";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SendIcon from "@material-ui/icons/Send";
import { DropzoneDialog } from "material-ui-dropzone";
import { ControlledEditor as Editor } from "@monaco-editor/react";
import MaterialMarkdown from "../../src/components/MaterialMarkdown";
import LoadingResultsProgress from "../../src/components/LoadingResultsProgress";
import CodeChallengeFeedbackList from "../../src/components/CodeChallengeFeedbackList";
import Alert from "../../src/components/Alert";
import {
  getChallenge,
  postChallenge,
  getSubmissionList,
  getSubmissionCode,
} from "../../src/client";
import { useQuiz } from "../../src/context/quiz-state";

const BaseEditor = styled(Editor)`
  min-height: 50vh;
`;

function saveCode(challenge, code) {
  if (!challenge) return;
  localStorage.setItem(`code.${challenge.slug}`, code);
}

function loadCode(challenge) {
  if (!challenge) return null;
  return localStorage.getItem(`code.${challenge.slug}`);
}

const LoadingContainer = styled.div`
  margin: 8em;
  display: flex;
  justify-content: center;
`;

const GridItem = styled(Grid)`
  padding-left: ${(props) => props.theme.spacing(3)}px;
  padding-right: ${(props) => props.theme.spacing(3)}px;
`;

function CodeChallenge({ challenge, initialSubmissions, slug }) {
  const [session, loading] = useSession();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [previousCode, setPreviousCode] = useState("");
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [passedTests, setPassedTests] = useState(false);
  const editorRef = useRef();
  const feedbackListRef = useRef();

  const { quiz } = useQuiz();

  useEffect(() => {
    const savedCode = loadCode(challenge);
    if (savedCode) setPreviousCode(savedCode);
    else if (submissions && submissions[0] && !previousCode) {
      loadSubmissionCode(submissions[0].id);
    }
  }, [submissions, session]);

  useEffect(() => {
    if (editorRef.current) editorRef.current.setValue(previousCode);
  }, [editorRef.current, previousCode]);

  const handleEditorDidMount = (_, editor) => {
    editorRef.current = editor;
    setSubmitEnabled(true);
  };

  const handleCodeFileUpload = (file) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      editorRef.current.setValue(event.target.result);
    });
    reader.readAsText(file);
  };

  const postSolution = () => {
    setSubmitEnabled(false);
    setPassedTests(false);
    setSubmissions(
      [{ id: "running", creation_date: new Date() }].concat(submissions)
    );
    feedbackListRef.current.scrollIntoView();

    postChallenge(slug, editorRef.current.getValue())
      .then((data) => {
        if (data.success) setPassedTests(true);
        setSubmissions([data].concat(submissions));
      })
      .catch((data) => {
        setSubmissions(
          [{ id: "error", creation_date: new Date() }].concat(submissions)
        );
      })
      .finally(() => {
        setSnackbarOpen(true);
        setSubmitEnabled(true);
      });
  };

  const loadFile = () => {
    setFileDialogOpen(true);
  };

  const loadSubmissionCode = (submissionId) => {
    if (session) {
      getSubmissionCode(session, slug, submissionId).then((data) => {
        if (data.code) setPreviousCode(data.code);
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleEditorChange = (event, value) => {
    saveCode(challenge, value);
  };

  const functionName =
    challenge && challenge.function_name ? (
      <Typography paragraph={true}>
        O nome da sua função deve ser{" "}
        <SyntaxHighlighter
          language="python"
          customStyle={{ padding: "0.1em" }}
          PreTag={"span"}
          style={prism}
        >
          {challenge.function_name}
        </SyntaxHighlighter>
      </Typography>
    ) : (
      ""
    );
  if (!challenge || (challenge.in_quiz && !quiz))
    return (
      <Typography>
        Este exercício não existe ou você não tem acesso a ele.
      </Typography>
    );

  return (
    <Box mb={3}>
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

        <GridItem item md={6}>
          <Typography variant="h2" component="h1" gutterBottom={true}>
            {challenge.title}
          </Typography>
          <MaterialMarkdown>{challenge.question}</MaterialMarkdown>
          {functionName}
        </GridItem>

        <GridItem
          style={{ display: "flex", flexDirection: "column" }}
          container
          item
          md={6}
        >
          <Paper
            style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
            elevation={3}
          >
            <Box style={{ flexGrow: 1, minHeight: "70vh" }} mt={2} mb={2}>
              <BaseEditor
                theme={"light"}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
                language={"python"}
                loading={<LoadingResultsProgress strokeWeight={3} />}
                value={previousCode}
                options={{ lineNumbers: "on", wordWrap: "on" }}
              />
            </Box>
          </Paper>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              disabled={!submitEnabled}
              onClick={loadFile}
              fullWidth={true}
              startIcon={<InsertDriveFileIcon />}
            >
              Carregar arquivo
            </Button>

            <DropzoneDialog
              acceptedFiles={[".py"]}
              dialogTitle="Carregar código"
              dropzoneText="Arraste um arquivo ou clique aqui"
              cancelButtonText="Cancelar"
              submitButtonText="Enviar"
              getFileLimitExceedMessage={(filesLimit) =>
                `Limite de arquivos excedido. Limite permitido: ${filesLimit} arquivo(s)`
              }
              getFileAddedMessage={(fileName) =>
                `Arquivo ${fileName} adicionado com sucesso`
              }
              getFileRemovedMessage={(fileName) =>
                `O arquivo ${fileName} removido`
              }
              getDropRejectMessage={(rejectedFile) =>
                `O arquivo ${rejectedFileName} foi rejeitado`
              }
              maxFileSize={1000000}
              filesLimit={1}
              multiple={false}
              open={fileDialogOpen}
              onClose={() => setFileDialogOpen(false)}
              onSave={(files) => {
                files.map(handleCodeFileUpload);
                setFileDialogOpen(false);
              }}
              showPreviews={false}
            />
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              disabled={!submitEnabled}
              color="primary"
              onClick={postSolution}
              fullWidth={true}
              endIcon={<SendIcon />}
            >
              Enviar
            </Button>
          </Box>
        </GridItem>

        <GridItem item md={12}>
          <Box mt={2}>
            <CodeChallengeFeedbackList
              ref={feedbackListRef}
              submissions={submissions}
              onLoadButtonClick={loadSubmissionCode}
            />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default CodeChallenge;

export async function getServerSideProps({ req, res, query }) {
  const slug = query.slug;
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: `/auth/login?callbackUrl=/programacao/${slug}`,
    });
    res.end();
    return { props: {} };
  }

  const [challenge, initialSubmissions] = await Promise.all([
    getChallenge(session, "code", slug),
    getSubmissionList(session, slug),
  ]);

  return {
    props: {
      slug,
      challenge,
      initialSubmissions,
    },
  };
}
