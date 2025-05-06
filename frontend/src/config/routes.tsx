const router = {
  main: {
    mask: "/",
    create: () => "/",
  },
  login: {
    mask: "/login",
    create: () => "/login",
  },
  logout: {
    mask: "/logout",
    create: () => "/logout",
  },
  signup: {
    mask: "/signup",
    create: () => "/signup",
  },
  passwordChange: {
    mask: "/password_change",
    create: () => "/password_change",
  },
  passwordChangeDone: {
    mask: "/password_change/done",
    create: () => "/password_change/done",
  },
  passwordReset: {
    mask: "/password_reset",
    create: () => "/password_reset",
  },
  passwordResetDone: {
    mask: "/password_reset/done",
    create: () => "/password_reset/done",
  },
  passwordResetConfirm: {
    mask: "/reset/:uidb64/:token",
    create: (uidb64: string, token: string) =>
      `/reset/${uidb64}/${token}`,
  },
  passwordResetComplete: {
    mask: "/reset/done",
    create: () => "/reset/done",
  },
  page404: {
    mask: "*",
    create: () => "*",
  }
}

export default router
