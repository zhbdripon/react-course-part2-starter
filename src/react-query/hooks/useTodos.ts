import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { CACHE_KEYS } from "../constants";

export interface Todo {
  id: number | Date;
  title: string;
  userId?: number;
  completed?: boolean;
}

const useTodos = () => {
  const fetchTodos = () => {
    return axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.data);
  };

  return useQuery<Todo[], AxiosError>({
    queryKey: CACHE_KEYS.TODO,
    queryFn: fetchTodos,
  });
};

export default useTodos;
