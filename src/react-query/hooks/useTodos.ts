import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { CACHE_KEYS } from "../constants";
import todoService, { Todo } from "../services/todoService";

const useTodos = () => {
  return useQuery<Todo[], AxiosError>({
    queryKey: CACHE_KEYS.TODO,
    queryFn: todoService.getAll,
  });
};

export default useTodos;
