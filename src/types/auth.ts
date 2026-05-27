export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
