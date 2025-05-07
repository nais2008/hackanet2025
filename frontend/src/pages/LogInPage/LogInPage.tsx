import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores/authStore";

import "./LoginPage.scss";

const LoginPage = observer(() => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authStore.login({ login, password });
      navigate("/"); // Редирект на главную после успешного логина
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
