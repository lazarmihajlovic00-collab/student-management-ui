// Kako izgleda Kurs koji dobijamo sa backenda
export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  maxStudents: number;
}

// Šta šaljemo backendu kada kreiramo kurs
export interface CourseRequest {
  name: string;
  code: string;
  credits: number;
  maxStudents: number;
  departmentId: number;
}