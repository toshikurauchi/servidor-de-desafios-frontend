import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useRouter } from "next/router";
import { csrfToken } from "next-auth/client";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import theme from "../src/theme";

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${theme.colors.BLUE2};
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

export default function Login({ csrfToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const hasError =
    router.query.error && router.query.error === "CredentialsSignin";

  const setOrError = (setter, errorSetter) => {
    return (event) => {
      let value = event.target.value;
      let error = "";
      if (!value) error = "Não pode ser vazio";
      setter(value);
      errorSetter(error);
    };
  };

  const handleUsernameChanged = setOrError(setUsername, setUsernameError);
  const handlePasswordChanged = setOrError(setPassword, setPasswordError);

  const hasEmptyFields = !(username && password);

  return (
    <CenteredContent height="100%">
      <GlobalStyle />
      <LogoImgBase src="/img/logo-big-pt.png" />
      <LoginBackBase elevation={3}>
        <CenteredContent p={2}>
          <Typography variant="h2" color="textPrimary">
            Login
          </Typography>

          <CenteredContent
            component="form"
            m={2}
            style={{ minWidth: "40vw" }}
            method="post"
            action="/api/auth/callback/credentials"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextField
              id="id-username"
              onChange={handleUsernameChanged}
              label="Usuário"
              variant="outlined"
              required={true}
              name="username"
              autoFocus={true}
              autoCapitalize="none"
              autoComplete="username"
              maxLength="150"
              helperText={usernameError}
              error={Boolean(usernameError)}
              fullWidth
            />

            <TextField
              id="id-password"
              onChange={handlePasswordChanged}
              label="Senha"
              variant="outlined"
              type="password"
              required={true}
              name="password"
              autoComplete="current-password"
              helperText={
                passwordError
                  ? passwordError
                  : "Caso você não tenha mudado, sua senha é igual ao nome de usuário"
              }
              error={Boolean(passwordError)}
              fullWidth
            />

            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
              disabled={hasEmptyFields}
            >
              Login
            </Button>
            {hasError && (
              <FormHelperText error={true}>
                Usuário ou senha incorretos
              </FormHelperText>
            )}
          </CenteredContent>
        </CenteredContent>
      </LoginBackBase>
    </CenteredContent>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await csrfToken(context),
    },
  };
}
