import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function postNewPassword(oldPassword, newPassword, repeatPassword) {
  return axios
    .post("/api/change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
      repeatPassword: repeatPassword,
    })
    .then((res) => res.data);
}

export async function getContentLists(session) {
  if (!session || !session.token) {
    return null;
  }
  const serverRes = await axios
    .get(BACKEND_URL + "/content/", {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .catch(() => null);
  return serverRes.data;
}

export function getChallenge(session, type, slug, short) {
  if (!session || !session.token) {
    return null;
  }
  const shortQuery = short ? "?short" : "";
  return axios
    .get(`${BACKEND_URL}/${type}/${slug}/${shortQuery}`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function getPage(session, contentSlug, pageSlug) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(
      `${BACKEND_URL}/content/page/${contentSlug}/${pageSlug}${
        pageSlug ? "/" : ""
      }`,
      {
        headers: {
          Authorization: `Token ${session.token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch(() => null);
}

export function listCodeChallenges(session, conceptSlug) {
  if (!session || !session.token) {
    return null;
  }
  const query = conceptSlug ? `?concept=${conceptSlug}` : "";
  return axios
    .get(`${BACKEND_URL}/code/${query}`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function listTraceChallenges(session, conceptSlug) {
  if (!session || !session.token) {
    return null;
  }
  const query = conceptSlug ? `?concept=${conceptSlug}` : "";
  return axios
    .get(`${BACKEND_URL}/trace/${query}`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function postChallenge(session, slug, code) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .post(
      `${BACKEND_URL}/code/${slug}/`,
      { code },
      { headers: { Authorization: `Token ${session.token}` } }
    )
    .then((res) => res.data)
    .catch(() => null);
}

export function getSubmissionList(session, slug) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(`${BACKEND_URL}/code/${slug}/submission`, {
      headers: { Authorization: `Token ${session.token}` },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function getSubmissionCode(session, slug, submissionId) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(`${BACKEND_URL}/code/${slug}/submission/${submissionId}/code`, {
      headers: { Authorization: `Token ${session.token}` },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function postTrace(
  session,
  slug,
  stateIndex,
  memory,
  terminal,
  nextLine,
  retval
) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .post(
      `${BACKEND_URL}/trace/${slug}/`,
      {
        state_index: stateIndex,
        memory,
        terminal,
        next_line: nextLine,
        retval,
      },
      {
        headers: { Authorization: `Token ${session.token}` },
      }
    )
    .then((res) => res.data)
    .catch(() => null);
}

export function getTraceStateList(session, slug) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(`${BACKEND_URL}/trace/${slug}/state`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => null);
}