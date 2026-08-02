export interface GradeResponse {
  id: number;
  value: number;
  examDate: string;
  studentName: string;
  courseName: string;
}

export interface GradeRequest {
  studentId: number;
  courseId: number;
  value: number;
  examDate: string;
}