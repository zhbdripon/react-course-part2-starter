import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { CACHE_KEYS } from "../constants";
import todoService, { Todo } from "../services/todoService";

interface AddTodoContext {
  preUpdateTodos: Todo[];
}

const useAddTodo = (onUpdateSuccess: () => void) => {
  const queryClient = useQueryClient();

  const todoMutation = useMutation<Todo, AxiosError, Todo, AddTodoContext>({
    mutationFn: (newTodo: Todo) => {
      return todoService.post(newTodo);
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
