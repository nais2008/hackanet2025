import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import { authStore } from "../../stores/authStore";
import { SignUpFormData } from "../../models/user";


const SignUpPage = observer(() => {
  const [form, setForm] = useState<SignUpFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    await authStore.signup(form);
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>

        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Подтверждение пароля"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="links">
          <Link to="/login">Есть аккаунт?</Link>
        </div>

        <button type="submit" className="btn" disabled={authStore.loading}>
          {authStore.loading ? "Регистрируем..." : "Зарегистрироваться"}
        </button>

        {authStore.error && <p className="error">{authStore.error}</p>}
      </form>
    </div>
  );
});

export default SignUpPage;
