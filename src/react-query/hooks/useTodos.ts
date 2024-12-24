import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { CACHE_KEYS } from "../constants";
import APIClient from "../services/apiClient";

export interface Todo {
  id: number | Date;
  title: string;
  userId?: number;
  completed?: boolean;
}
const apiClient = new APIClient<Todo>("/todos");

const useTodos = () => {
  return useQuery<Todo[], AxiosError>({
    queryKey: CACHE_KEYS.TODO,
    queryFn: apiClient.getAll,
  });
};

export default useTodos;
