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
import _ from "lodash";

const TableContainerBase = styled(TableContainer)`
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;

function ContentChallenges({ content, challenges, traces }) {
  const router = useRouter();

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
                    <TableCell>Ok</TableCell>
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
                    <TableCell>Ok</TableCell>
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
