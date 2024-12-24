import { useRef } from "react";
import useAddTodo from "./hooks/useAddTodo";

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const todoMutation = useAddTodo(() => {
    if (ref.current) ref.current.value = "";
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
            let a = todoMutation.mutate({
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
