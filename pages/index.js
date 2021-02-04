import React from "react";
import { getSession } from "next-auth/client";
import styled from "styled-components";

const Container = styled.div`
  width: 960px;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: #f2f2f2;
`;

export default function Home() {
  return <Container>HELLO</Container>;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
  }

  return {
    props: {},
  };
}
