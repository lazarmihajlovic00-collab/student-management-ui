// Osnovni interfejs za kurs koji dolazi uz studenta
export interface CourseResponse {
  id: number;
  name: string;
}

// Kako izgleda Student kojeg dobijamo sa Spring Boot-a (StudentResponse.java)
export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED';
  enrollmentDate: string;
  graduationDate: string | null;
  departmentName: string | null;
  courses: CourseResponse[];
}

// Spring Boot nam ne vraća samo listu, već Page objekat sa paginacijom
export interface PageResponse<T> {
  content: T[];         // Ovde se nalazi niz naših studenata
  totalPages: number;   // Koliko ukupno strana ima
  totalElements: number;// Koliko ukupno studenata ima
  size: number;         // Koliko po strani
  number: number;       // Trenutna strana
}

// Ono što šaljemo backendu kada kreiramo studenta
export interface StudentRequest {
  name: string;
  email: string;
  age: number;
}