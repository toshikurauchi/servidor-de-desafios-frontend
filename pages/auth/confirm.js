import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import theme from "../../src/theme";
import Link from "../../src/components/Link";

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${theme.colors.BLUE2} !important;
}
`;

const CenteredContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
`;

const LogoImgBase = styled.img`
  max-height: 30vh;
`;

const LoginBackBase = styled(Paper)`
  background-color: ${(props) => props.theme.colors.GRAY2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Login({ confirmed }) {
  return (
    <CenteredContent height="100%">
      <GlobalStyle />
      <LogoImgBase src="/img/logo-big-pt.png" />
      <LoginBackBase elevation={3}>
        <CenteredContent p={2}>
          {confirmed ? (
            <>
              <Typography variant="h2" color="textPrimary">
                Cadastro concluído!
              </Typography>
              <Typography>
                Faça seu <Link href="/auth/login">login</Link> para entrar no
                servidor.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h2" color="textPrimary">
                Ocorreu um erro no cadastro :(
              </Typography>
              <Typography>
                Por favor, <Link href="/auth/signup">tente novamente</Link>. Se
                não funcionar, entre em contato com o professor.
              </Typography>
            </>
          )}
        </CenteredContent>
      </LoginBackBase>
    </CenteredContent>
  );
}

export async function getServerSideProps(context) {
  const user_token = context.query.token;
  const token = process.env.BACKEND_TOKEN;

  const data = await axios
    .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/confirm/", {
      user_token,
      token,
    })
    .then((res) => res.data)
    .catch(() => ({ confirmed: false, msg: "server error" }));

  return {
    props: { confirmed: data.confirmed },
  };
}
