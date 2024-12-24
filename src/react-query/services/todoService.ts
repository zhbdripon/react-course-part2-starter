import APIClient from "./apiClient";

export interface Todo {
  id: number | Date;
  title: string;
  userId?: number;
  completed?: boolean;
}

export default new APIClient<Todo>("/todos");
