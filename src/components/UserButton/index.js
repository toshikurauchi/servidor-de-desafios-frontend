import React, { useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ChangePasswordDialog from "../ChangePasswordDialog";

const BaseLink = styled.a`
  text-decoration: none;
  display: block;
`;

function UserButton() {
  const [session, loading] = useSession();
  const user = session ? session.user : undefined;

  const menuButton = useRef();
  const [changePasswordOpened, setChangePasswordOpened] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  const handleMenu = () => setMenuOpened(true);
  const handleClose = () => setMenuOpened(false);
  const handlePasswordChange = () => setChangePasswordOpened(true);
  const handlePasswordChangeClose = () => setChangePasswordOpened(false);

  let button;
  if (user) {
    button = (
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          ref={menuButton}
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={menuButton.current}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={menuOpened}
          onClose={handleClose}
        >
          <MenuItem onClick={handlePasswordChange}>Mudar a senha</MenuItem>
          <BaseLink onClick={signOut}>
            <MenuItem>Logout</MenuItem>
          </BaseLink>
        </Menu>
        <ChangePasswordDialog
          opened={changePasswordOpened}
          onClose={handlePasswordChangeClose}
        />
      </div>
    );
  } else {
    button = (
      <Button color="inherit" onClick={signIn}>
        Login
      </Button>
    );
  }

  return button;
}

export default UserButton;
