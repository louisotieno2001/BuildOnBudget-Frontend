import { apiFetch } from '@/services/api';

export type SignupPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
  user: unknown;
};

export type LoginResponse = {
  message: string;
  redirect?: string;
};

export function signup(payload: SignupPayload) {
  return apiFetch<SignupResponse>('/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
