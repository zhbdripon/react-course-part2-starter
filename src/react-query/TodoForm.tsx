import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Todo } from "./hooks/useTodos";

interface AddTodoContext {
  preUpdateTodos: Todo[];
}

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const todoMutation = useMutation<Todo, AxiosError, Todo, AddTodoContext>({
    mutationFn: (newTodo: Todo) => {
      return axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", newTodo)
        .then((res) => res.data);
    },
    onMutate: (newTodo) => {
      const preUpdateTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];

      queryClient.setQueriesData<Todo[]>(["todos"], (todos) => [
        newTodo,
        ...(todos || []),
      ]);

      return { preUpdateTodos };
    },
    onSuccess: (savedTodo, newTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => {
        return (todos || []).map((todo) => {
          return todo === newTodo ? savedTodo : todo;
        });
      });

      if (ref.current) {
        ref.current.value = "";
      }
    },
    onError: (error, newTodo, context) => {
      if (context) {
        queryClient.setQueryData<Todo[]>(["todos"], context.preUpdateTodos);
      }
    },
  });

  return (
    <>
      {todoMutation.error && (
        <div className="alert alert-danger">{todoMutation.error.message}</div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (ref.current?.value) {
            todoMutation.mutate({
              id: new Date(),
              title: ref.current?.value,
            });
          }
        }}
        className="row mb-3"
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary">Add</button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
