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

export function listConcepts(session) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(`${BACKEND_URL}/concept/`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => []);
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

export function postChallenge(slug, code) {
  return axios
    .post(`/api/code/${slug}/`, { code })
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
  slug,
  stateIndex,
  memory,
  terminal,
  nextLine,
  retval
) {
  return axios
    .post(`/api/trace/${slug}/`, {
      state_index: stateIndex,
      memory,
      terminal,
      next_line: nextLine,
      retval,
    })
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

export function getInteractions(session, type) {
  if (!session || !session.token) {
    return [];
  }
  return axios
    .get(`${BACKEND_URL}/${type}/interaction/`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => []);
}

export function getThanks() {
  return axios
    .get(`${BACKEND_URL}/thanks/`)
    .then((res) => res.data)
    .catch(() => []);
}

export function loadQuiz(session, slug) {
  if (!session || !session.token) {
    return null;
  }
  return axios
    .get(`${BACKEND_URL}/quiz/${slug}/`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => {
      const quiz = res.data;
      if (quiz.duration <= 0 || quiz.submitted) return null;
      return quiz;
    })
    .catch(() => null);
}

export function getRemainingQuizTime(session, slug) {
  if (!session || !session.token) {
    return 0;
  }
  return axios
    .get(`${BACKEND_URL}/quiz/${slug}/remaining-time/`, {
      headers: {
        Authorization: `Token ${session.token}`,
      },
    })
    .then((res) => res.data)
    .catch(() => 0);
}
