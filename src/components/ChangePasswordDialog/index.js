import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { postNewPassword } from "../../client";

function ChangePasswordDialog(props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const handleSubmit = () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setRepeatPasswordError("");
    postNewPassword(oldPassword, newPassword, repeatPassword)
      .then((data) => {
        if (data.code === 0) handleClose();
        else if (data.code === 1)
          setOldPasswordError("A senha antiga está incorreta");
        else if (data.code === 2)
          setRepeatPasswordError("As novas senhas digitadas não são iguais");
        else if (data.code === 3)
          setNewPasswordError("A nova senha deve ser diferente da anterior");
      })
      .catch(console.error);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const setOrError = (setter, errorSetter) => {
    return (event) => {
      let password = event.target.value;
      let error = "";
      if (!password) error = "Não pode ser vazio";
      setter(password);
      errorSetter(error);
    };
  };

  const handleOldPasswordChanged = setOrError(
    setOldPassword,
    setOldPasswordError
  );
  const handleNewPasswordChanged = setOrError(
    setNewPassword,
    setNewPasswordError
  );
  const handleRepeatPasswordChanged = setOrError(
    setRepeatPassword,
    setRepeatPasswordError
  );

  const hasEmptyFields = !(oldPassword && newPassword && repeatPassword);

  return (
    <Dialog
      open={props.opened}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Mudar a senha</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Senha antiga"
          type="password"
          required={true}
          onChange={handleOldPasswordChanged}
          autoComplete="current-password"
          variant="outlined"
          helperText={oldPasswordError}
          error={Boolean(oldPasswordError)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Nova senha"
          type="password"
          required={true}
          onChange={handleNewPasswordChanged}
          name="new-password"
          variant="outlined"
          helperText={newPasswordError}
          error={Boolean(newPasswordError)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Repetir nova senha"
          type="password"
          required={true}
          onChange={handleRepeatPasswordChanged}
          name="repeat-password"
          variant="outlined"
          helperText={repeatPasswordError}
          error={Boolean(repeatPasswordError)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          type="submit"
          disabled={hasEmptyFields}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePasswordDialog;
