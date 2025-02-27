import { useEffect, useState } from "react";
import supabase from "./supabase-client";


function App() {
  const [todoList, setTodoList] = useState([])

  //since want to call fetchTodos on 1st render
  useEffect(() => {
    // console.log("useEffect called");
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    // console.log("fetchTodos called");
    const { data, error } = await supabase.from("TodoList").select("*");
    //destructure response get back from supabase. should return an array
    if (error) {
      console.log("Error fetching: ", error)
    } else {
      // console.log("Data fetched: ", data);
      setTodoList(data)
    }
  };

  return (
    <>
      <h1>Todo List</h1>
      <ul>
        {todoList.map((todo) => (
          <li key={todo.id}>
            <p>{todo.name}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
