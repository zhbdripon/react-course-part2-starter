import axios, { AxiosError } from "axios";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Todo } from "./hooks/useTodos";

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const todoMutation = useMutation<Todo, AxiosError, Todo>({
    mutationFn: (newTodo: Todo) => {
      return axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", newTodo)
        .then((res) => res.data);
    },
    onSuccess: (savedTodo, newTodo) => {
      //Option 1: Invalidating the cache
      // queryClient.invalidateQueries({ queryKey: ["todos"]})

      // Option 2: Updating the data in the cache
      queryClient.setQueriesData<Todo[]>(["todos"], (todos) => [
        savedTodo,
        ...(todos || []),
      ]);

      if (ref.current) {
        ref.current.value = "";
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
