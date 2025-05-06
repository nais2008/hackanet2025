import { makeAutoObservable, runInAction } from "mobx";
import { Credentials, SignUpFormData, AuthResponse } from "../models/user";

const BASE_URL = import.meta.env.VITE_URL_BACKEND;

class AuthStore {
  userId: number | null = null;
  loading = false;
  error: string | null = null;
  user: AuthResponse["user"] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(creds: Credentials) {
    this.loading = true;
    this.error = null;

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.login, password: creds.password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0] || "Неверный логин или пароль");
      }

      // Получаем данные пользователя после успешного логина
      const userRes = await fetch(`${BASE_URL}/users/${creds.login}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!userRes.ok) throw new Error("Не удалось получить данные пользователя");

      const userData = await res.json();

      runInAction(() => {
        this.userId = userData.id;
        this.user = {
          id: userData.id,
          name: userData.name || "",
          username: userData.username,
          email: userData.email,
        };
        this.loading = false;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Неизвестная ошибка";
        this.loading = false;
      });
    }
  }

  async signup(form: SignUpFormData) {
    this.loading = true;
    this.error = null;

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.errors?.[0] || "Ошибка при регистрации");
      }

      const data = await res.json();

      runInAction(() => {
        this.userId = data.id;
        this.user = {
          id: data.id,
          name: form.name,
          username: form.username,
          email: form.email,
        };
        this.loading = false;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Неизвестная ошибка";
        this.loading = false;
      });
    }
  }

  async logout() {
    if (!this.userId) return;

    try {
      const res = await fetch(`${BASE_URL}/logout/${this.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Ошибка при выходе");

      runInAction(() => {
        this.userId = null;
        this.user = null;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Неизвестная ошибка";
      });
    }
  }

  get isAuthenticated() {
    return !!this.userId;
  }
}

export const authStore = new AuthStore();
