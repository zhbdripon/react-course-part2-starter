import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { CACHE_KEYS } from "../constants";
import APIClient from "../services/apiClient";
import { Todo } from "./useTodos";

interface AddTodoContext {
  preUpdateTodos: Todo[];
}

const apiClient = new APIClient<Todo>("/todos");

const useAddTodo = (onUpdateSuccess: () => void) => {
  const queryClient = useQueryClient();

  const todoMutation = useMutation<Todo, AxiosError, Todo, AddTodoContext>({
    mutationFn: (newTodo: Todo) => {
      return apiClient.post(newTodo);
    },
    onMutate: (newTodo) => {
      const preUpdateTodos =
        queryClient.getQueryData<Todo[]>(CACHE_KEYS.TODO) || [];

      queryClient.setQueriesData<Todo[]>(CACHE_KEYS.TODO, (todos = []) => [
        newTodo,
        ...todos,
      ]);

      return { preUpdateTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(CACHE_KEYS.TODO, (todos) => {
        return (todos || []).map((todo) => {
          return todo === newTodo ? savedTodo : todo;
        });
      });

      onUpdateSuccess();
    },
    onError: (error, newTodo, context) => {
      if (context) {
        queryClient.setQueryData<Todo[]>(
          CACHE_KEYS.TODO,
          context.preUpdateTodos
        );
      }
    },
  });

  return todoMutation;
};

export default useAddTodo;
