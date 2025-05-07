import { makeObservable, observable, action, runInAction } from "mobx";
import { Credentials, AuthResponse } from "../models/user";


class AuthStore {
  user: AuthResponse["user"] | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      loading: observable,
      error: observable,
      login: action,
      logout: action,
      clearError: action,
    });
  }

  async login(credentials: Credentials): Promise<void> {
    this.loading = true;
    this.error = null;

    const loginUrl = "/api/login";
    const requestBody = {
      username: credentials.login, // Используем username для сервера
      password: credentials.password,
    };
    console.log("Sending login request to:", loginUrl);
    console.log("Request body:", JSON.stringify(requestBody));

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = "Ошибка входа";
        try {
          const errorData = await response.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((err: string) => {
                if (err === "user not found") return "Пользователь не найден";
                if (err === "invalid password") return "Неверный пароль";
                return err;
              })
              .join("; ");
          } else {
            errorMessage = errorData.message || `Ошибка: ${response.status}`;
          }
        } catch {
          errorMessage = await response.text() || `Ошибка: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();

      runInAction(() => {
        this.user = data.user;
        this.loading = false;
      });
    } catch (error) {
      console.error("Fetch error:", error);
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Ошибка сервера";
        this.loading = false;
      });
      throw error;
    }
  }

  logout(): void {
    this.user = null;
    this.error = null;
    this.loading = false;
  }

  clearError(): void {
    this.error = null;
  }
}

export const authStore = new AuthStore();
