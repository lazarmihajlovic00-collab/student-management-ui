// Sta se šalje backendu prilikom prijave
export interface LoginRequest {
  email: string;
  password: string;
}

// Šta backend vraća nakon uspešne prijave
export interface AuthResponse {
  accessToken: string;   
  refreshToken: string;  
}

// Šta se sve nalazi otpakovano unutar JWT Tokena
export interface UserPayload {
  sub: string;  // Email korisnika (po JWT standardu to je 'sub' - subject)
  role: string; // ROLE_ADMIN ili ROLE_USER (ili samo ADMIN)
  name: string; // Puno ime koje se nalazi u JWT tokenu;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}