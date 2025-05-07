// Модель пользователя для работы с API и MobX

export interface Credentials {
  login: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string; // Добавлен токен, если он возвращается из API
}
