import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/client";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { getContentLists, getThanks } from "../src/client";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

const ThanksPage = ({ authors }) => {
  return (
    <>
      <Typography variant="h1" component="h2">
        Agradecimentos
      </Typography>
      <Typography paragraph={true}>
        Esta página lista as pessoas que contribuiram diretamente para este
        software.
      </Typography>
      <Grid container justify="center" spacing={2}>
        {authors.map((author) => (
          <Grid
            item
            style={{ display: "flex", flexDirection: "column" }}
            xs={6}
            md={3}
            key={author.title}
          >
            <Card style={{ flexGrow: 1 }}>
              <CardMedia
                component="img"
                alt={author.title}
                image={STATIC_URL + "thanks/img/" + author.photo}
                title={author.title}
              />
              <CardContent>
                <Typography variant="h5" component="h2">
                  {author.title}
                </Typography>
                <Typography
                  gutterBottom
                  color="textSecondary"
                  variant="h6"
                  component="h5"
                >
                  {author.subtitle}
                </Typography>
                <Typography paragraph={true}>{author.contribution}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ThanksPage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    context.res.writeHead(302, { Location: "/login?callbackUrl=/" });
    context.res.end();
  }

  const [contentLists, authors] = await Promise.all([
    getContentLists(session),
    getThanks(),
  ]);

  return {
    props: {
      contentLists,
      authors,
    },
  };
}
