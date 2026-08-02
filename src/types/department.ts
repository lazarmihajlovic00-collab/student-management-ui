// Kako izgleda Smer koji dobijamo sa backenda
export interface Department {
  id: number;
  name: string;
  code: string;
}

// Šta šaljemo backendu kada kreiramo/menjamo smer
export interface DepartmentRequest {
  name: string;
  code: string;
}