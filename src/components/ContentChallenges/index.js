import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";

const TableContainerBase = styled(TableContainer)`
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;

const CorrectIcon = styled(CheckIcon)`
  color: ${(props) => props.theme.colors.SUCCESS};
`;

const WrongIcon = styled(CloseIcon)`
  color: ${(props) => props.theme.colors.DANGER};
`;

function ContentChallenges({
  content,
  challenges,
  traces,
  challengeInteractionsBySlug,
  traceInteractionsBySlug,
}) {
  const router = useRouter();

  const getResult = (interactionsBySlug, challenge) => {
    const interaction = interactionsBySlug[challenge.slug];
    if (interaction && interaction.completed) {
      return <CorrectIcon />;
    } else if (interaction && !interaction.completed) {
      return <WrongIcon />;
    }
    return null;
  };

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom={true}>
        {content.title}
      </Typography>
      {!_.isEmpty(challenges) && (
        <>
          <Typography variant="h4" component="h2" gutterBottom={true}>
            Exercícios de Programação
          </Typography>

          <TableContainerBase component={Paper}>
            <Table aria-label="exercícios de programação">
              <colgroup>
                <col />
                <col width="2rem" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Situação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {challenges.map((challenge) => (
                  <TableRow
                    hover
                    key={`codechallenge___${challenge.slug}`}
                    onClick={() =>
                      router.push(`/programacao/${challenge.slug}`)
                    }
                  >
                    <TableCell component="th" scope="row">
                      {challenge.title}
                    </TableCell>
                    <TableCell align="center">
                      {getResult(challengeInteractionsBySlug, challenge)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainerBase>
        </>
      )}
      {!_.isEmpty(traces) && (
        <>
          <Typography variant="h4" component="h2" gutterBottom={true}>
            Testes de Mesa
          </Typography>

          <TableContainerBase component={Paper}>
            <Table aria-label="testes de mesa">
              <colgroup>
                <col />
                <col width="2rem" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Situação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {traces.map((challenge) => (
                  <TableRow
                    hover
                    key={`tracechallenge___${challenge.slug}`}
                    onClick={() =>
                      router.push(`/teste-de-mesa/${challenge.slug}`)
                    }
                  >
                    <TableCell component="th" scope="row">
                      {challenge.title}
                    </TableCell>
                    <TableCell align="center">
                      {getResult(traceInteractionsBySlug, challenge)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainerBase>
        </>
      )}
    </>
  );
}

export default ContentChallenges;
