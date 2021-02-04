import { getSession } from "next-auth/client";
import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session || !session.token) {
      res.status(403);
      return;
    }
    const serverRes = await axios
      .post(process.env.BACKEND_URL + "/change-password/", req.body, {
        headers: {
          Authorization: `Token ${session.token}`,
        },
      })
      .catch(() => null);
    res.status(serverRes.status).json(serverRes.data);
  }
};
