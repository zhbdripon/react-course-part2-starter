import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const useTodos = () => {
  const fetchTodos = () => {
    return axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.data);
  };

  return useQuery<Todo[], AxiosError>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};

export default useTodos;
