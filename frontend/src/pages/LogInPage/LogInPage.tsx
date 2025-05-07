import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import "./LoginPage.scss";

const LoginPage = observer(() => {

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="links">
          <Link to="/signup">Нет аккаунта?</Link>
        </div>
        <button type="submit" className="btn" disabled={authStore.loading}>
          {authStore.loading ? "Входим..." : "Войти"}
        </button>
        {authStore.error && (
          <p className="error" style={{ color: "red", marginTop: "10px" }}>
            {authStore.error}
          </p>
        )}
      </form>
    </div>
  );
});

export default LoginPage;
