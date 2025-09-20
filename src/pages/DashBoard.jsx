import React, { useEffect, useState } from "react";
import api from "../services/api";

function DashBoard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState("");
  const [completed, setCompleted] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const res = await api.get("/getTodos");
      setTodos(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // Handle add/update todo
  const handleSubmit = async () => {
    try {
      if (editId) {
        const res = await api.put(`/edit/${editId}`, {
          title,
          description,
          completed,
        });

        setMsg(res.data.msg);
        setEditId("");
      } else {
        const res = await api.post("/add", { title, description });
        setMsg(res.data.msg);
      }

      setTitle("");
      setDescription("");
      setCompleted(false);
      fetchTodos();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Something went wrong...");
    }
  };

  // Handle edit
  const handleEdit = (todo) => {
    setEditId(todo._id || "");
    setTitle(todo.title || "");
    setDescription(todo.description || "");
    setCompleted(todo.completed || false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    console.log(id);
    try {
      await api.put(`/delete/${id}`);
      setMsg("Task deleted successfully");
      fetchTodos();
    } catch (error) {
      setMsg(error.response?.data?.msg || "Delete failed");
    }
  };

  // Toggle completed directly from list
  // Toggle completed directly from list
  const toggleCompleted = async (todo) => {
    try {
      await api.put(`/edit/${todo._id}`, {
        completed: !todo.completed,
        title: todo.title, // include title & description to avoid overwriting
        description: todo.description,
      });
      fetchTodos();
    } catch (error) {
      console.log(error);
      setMsg("Update failed");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gradient-to-tr from-indigo-900 to-indigo-700 p-4 shadow-2xl flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          Todo Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:shadow-black-500/30 transition"
        >
          Logout
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gray-800 p-4 flex flex-col gap-3 shadow-xl rounded-xl">
          <input
            type="text"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="p-2 bg-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="p-2 bg-gray-700 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl py-2 font-semibold shadow hover:shadow-indigo-500/30 transition"
          >
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {msg && <p className="text-indigo-400 mt-4 text-center">{msg}</p>}
      </div>

      <main className="p-6 max-w-2xl mx-auto">
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-gray-800 border-l-4 border-indigo-500 rounded-xl p-4 flex justify-between items-center hover:shadow-lg hover:shadow-indigo-500/30 transition"
            >
              <div>
                <h2
                  className={`font-semibold text-lg ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-300"
                  } hover:text-white transition`}
                >
                  {todo.title}
                </h2>
                <p
                  className={`text-sm ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {todo.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Completed checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo)}
                  className="cursor-pointer"
                />

                {/* Edit Icon */}
                <svg
                  onClick={() => handleEdit(todo)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400 hover:text-yellow-300 cursor-pointer transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  title="Edit"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-5.586-7.586a2 2 0 112.828 2.828L11 14l-4 1 1-4 7.414-7.414z"
                  />
                </svg>

                {/* Delete Icon */}
                <svg
                  onClick={() => handleDelete(todo._id)}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 hover:text-red-400 cursor-pointer transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  title="Delete"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v0a1 1 0 001 1h4a1 1 0 001-1v0a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default DashBoard;
