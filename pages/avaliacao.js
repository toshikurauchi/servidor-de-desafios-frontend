import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "../src/components/Link";
import { useQuiz } from "../src/context/quiz-state";
import MaterialMarkdown from "../src/components/MaterialMarkdown";

function round(n) {
  return Math.round(100 * n) / 100;
}

const InputSlugBase = styled(InputBase)`
  && {
    font-size: 3rem;
    text-align: center;
  }
`;

const AvaliacaoPage = () => {
  const idRef = useRef(null);
  const router = useRouter();

  const { quiz, setQuiz, reloadQuiz } = useQuiz();
  const [quizError, setQuizError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (quiz) reloadQuiz();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const slug = idRef.current && idRef.current.value;
    axios
      .post("/api/quiz", {
        slug,
        action: "start",
      })
      .then((res) => {
        const loadedQuiz = res.data;
        if (loadedQuiz.duration < 0 || loadedQuiz.submitted) {
          setQuizError("Esse quiz já foi finalizado");
          setQuiz(null);
          return;
        }
        setQuiz(loadedQuiz);
      })
      .catch((res) => {
        if (res.response.status === 404) setQuizError("Esse quiz não existe");
        else
          setQuizError(
            "Erro na obtenção do quiz. Por favor, verifique o ID e tente novamente"
          );
      });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (quiz) {
    const nQuestoes = quiz.challenges.length;
    const pontosTotais = round(10 / nQuestoes);
    const pontosAuto = round(pontosTotais * 0.4);
    const pontosManual = pontosTotais - pontosAuto;
    return (
      <>
        <Typography variant="h1" style={{ marginBottom: "2rem" }}>
          {quiz.title}
        </Typography>
        {quiz.description && (
          <MaterialMarkdown>{quiz.description}</MaterialMarkdown>
        )}
        {!quiz.description && (
          <>
            <Typography paragraph={true}>Prezado(a) Aluno(a),</Typography>
            <Typography paragraph={true}>
              Você terá {quiz.duration} minutos para concluir esta avaliação,
              administre bem o seu tempo. Leia atentamente as instruções a
              seguir e as questões da avaliação antes de começar a resolvê-la.
            </Typography>
            <ol>
              <li>
                Esta avaliação é composta de {nQuestoes}{" "}
                {nQuestoes === 1 ? "questão" : "questões"}
              </li>
              <li>
                Consulta a colegas ou quaisquer outras pessoas além dos
                aplicadores constituirá violação ao Código de Ética e de Conduta
                e acarretará sanções nele previstas. Faça o seu trabalho de
                maneira ética!
              </li>
              {quiz.has_manual_assessment ? (
                <li>
                  Cada questão vale {pontosTotais} pontos divididos da seguinte
                  maneira:
                  <ul>
                    <li>
                      A correção do servidor vale {pontosAuto} pontos se a
                      solução for considerada correta ou zero, caso contrário;
                    </li>
                    <li>
                      A avaliação do código pelos professores vale até{" "}
                      {pontosManual} pontos. O código será avaliado de acordo
                      com a seguinte rubrica:
                    </li>
                  </ul>
                </li>
              ) : (
                <li>
                  Será considerada a correção automática do servidor. Assim, não
                  existe acerto parcial.
                </li>
              )}
            </ol>
            {quiz.has_manual_assessment && (
              <TableContainer component={Paper}>
                <Table aria-label="rubrica">
                  <TableHead>
                    <TableRow>
                      <TableCell>0 pontos</TableCell>
                      <TableCell>{round(pontosManual * 0.2)} pontos</TableCell>
                      <TableCell>{round(pontosManual * 0.4)} pontos</TableCell>
                      <TableCell>{round(pontosManual * 0.6)} pontos</TableCell>
                      <TableCell>{round(pontosManual * 0.8)} pontos</TableCell>
                      <TableCell>{pontosManual} pontos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Código em branco, ou não é possível compreender a
                        lógica, ou não faz o que foi pedido
                      </TableCell>
                      <TableCell>
                        Lógica incorreta, mas dentro do que foi pedido
                      </TableCell>
                      <TableCell>
                        Lógica coerente com o que foi pedido, mas com erros de
                        sintaxe ou erros graves de execução
                      </TableCell>
                      <TableCell>
                        Lógica quase correta, mas com erros de execução
                      </TableCell>
                      <TableCell>
                        Lógica correta, mas com código desnecessariamente
                        complexo
                      </TableCell>
                      <TableCell>Lógica correta e código legível</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Typography paragraph={true} style={{ marginTop: "2em" }}>
              Boa Prova!
            </Typography>
          </>
        )}

        <Typography variant="h2" paragraph={true}>
          Questões
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="questões">
            <TableBody>
              {quiz.challenges
                .sort((c1, c2) => c1.title.localeCompare(c2.title))
                .map((challenge) => (
                  <TableRow key={`challenge__${challenge.slug}`}>
                    <TableCell style={{ padding: 0, display: "flex" }}>
                      <Link
                        href={`/programacao/${challenge.slug}`}
                        style={{
                          flexGrow: 1,
                          padding: "1rem",
                          fontSize: "1rem",
                        }}
                      >
                        {challenge.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          style={{ marginTop: "1em" }}
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Terminei!
        </Button>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Terminou?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Confirme se quer submeter a avaliação.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                axios
                  .post("/api/quiz", {
                    slug: quiz.slug || (idRef.current && idRef.current.value), // TODO NOT WORKING
                    action: "submit",
                  })
                  .then(() => {
                    router.reload();
                  })
                  .catch(console.error);
                handleCloseDialog();
              }}
              color="primary"
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h1" component="h2" style={{ textAlign: "center" }}>
          Avaliação
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "3rem",
          }}
        >
          <div style={{ maxWidth: 400 }}>
            <Typography>
              Digite o ID da avaliação fornecido pelo professor.
            </Typography>
            <Paper
              style={{
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputSlugBase
                fullWidth
                style={{ textAlign: "center" }}
                inputRef={idRef}
                autoFocus={true}
                onChange={() => setQuizError("")}
              ></InputSlugBase>
            </Paper>
            {quizError && <Typography color="error">{quizError}</Typography>}
            <Button
              variant="contained"
              type="submit"
              color="primary"
              fullWidth
              style={{ marginTop: "1em" }}
            >
              Iniciar
            </Button>
          </div>
        </form>
      </>
    );
  }
};

export default AvaliacaoPage;

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/auth/login?callbackUrl=/" });
    res.end();
  }

  return { props: {} };
}
