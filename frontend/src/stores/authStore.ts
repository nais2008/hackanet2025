import { makeAutoObservable, runInAction } from "mobx";
import { Credentials, SignUpFormData, AuthResponse } from "../models/user";
import { saveToken, getToken, removeToken } from "../utils/tokenStorage";

class AuthStore {
  token: string | null = getToken();
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });

      if (!res.ok) throw new Error("Неверный логин или пароль");

      const data: AuthResponse = await res.json();

      runInAction(() => {
        this.token = data.token;
        this.user = data.user;
        saveToken(data.token);
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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Ошибка при регистрации");

      const data: AuthResponse = await res.json();

      runInAction(() => {
        this.token = data.token;
        this.user = data.user;
        saveToken(data.token);
        this.loading = false;
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "Неизвестная ошибка";
        this.loading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    removeToken();
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

export const authStore = new AuthStore();
