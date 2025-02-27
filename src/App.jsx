import { useEffect, useState } from "react";
import supabase from "./supabase-client";
import Dashboard from "./Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error(error.message);
  };

  if (!session) {
    return (
      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;


// function App() {
//   const [todoList, setTodoList] = useState([])

//   //since want to call fetchTodos on 1st render
//   useEffect(() => {
//     // console.log("useEffect called");
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     // console.log("fetchTodos called");
//     const { data, error } = await supabase.from("TodoList").select("*");
//     //destructure response get back from supabase. should return an array
//     if (error) {
//       console.log("Error fetching: ", error)
//     } else {
//       // console.log("Data fetched: ", data);
//       setTodoList(data)
//     }
//   };

//   return (
//     <>
//       <h1>Todo List</h1>
//       <ul>
//         {todoList.map((todo) => (
//           <li key={todo.id}>
//             <p>{todo.name}</p>
//           </li>
//         ))}
//       </ul>
//     </>
//   )
// }

// export default App
