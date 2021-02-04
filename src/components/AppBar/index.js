import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import CookieConsent from "react-cookie-consent";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import Link from "../Link";
import UserButton from "../UserButton";

const AppBarBase = styled(AppBar)`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
`;

const MenuButton = styled(IconButton)`
  margin-right: ${(props) => props.theme.spacing(2) + "px"};
  ${(props) => props.theme.breakpoints.up("sm")} {
    &.MuiButtonBase-root {
      display: none;
    }
  }
`;

const AppTitle = styled.div`
  flex-grow: 1;
`;

const HomeLinkBase = styled(Link)`
  display: flex;
`;

const AppLogo = styled.img`
  max-height: 3rem;
  margin: ${(props) => props.theme.spacing(1)};
`;

export default function PyGymAppBar() {
  const router = useRouter();

  if (router.pathname.startsWith("/login")) return null;

  return (
    <AppBarBase position="fixed">
      <CookieConsent location="bottom" buttonText="Concordo">
        Este site utiliza cookies para melhorar a experiência do usuário.
      </CookieConsent>
      <Toolbar>
        <MenuButton
          color="inherit"
          aria-label="abrir"
          edge="start"
          // onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </MenuButton>
        <AppTitle>
          <HomeLinkBase href="/">
            <AppLogo src="/img/logo.svg" alt="Logo" />
          </HomeLinkBase>
        </AppTitle>
        <UserButton />
      </Toolbar>
    </AppBarBase>
  );
}
