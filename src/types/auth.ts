// Sta se šalje backendu prilikom prijave
export interface LoginRequest {
  username: string;
  password: string;
}

// Šta backend vraća nakon uspešne prijave
export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}