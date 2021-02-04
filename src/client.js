import axios from "axios";

export function postNewPassword(oldPassword, newPassword, repeatPassword) {
  return axios
    .post("/api/change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
      repeatPassword: repeatPassword,
    })
    .then((res) => res.data);
}
