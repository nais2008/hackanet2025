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

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}
