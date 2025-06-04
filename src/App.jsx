import React, { useState, useEffect } from 'react'
import SubmitForm from './components/SubmitForm';
import List from './components/List';
import "./style.scss";

const getLocalStorage = () => {
  let todos = localStorage.getItem('todos');
  if (todos == null) return []
  return JSON.parse(todos)
}

function App() {
  const [todos, setTodos] = useState(getLocalStorage());
  const [filter, setFilter] = useState('All');
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-theme");

  //Local Storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  //Easter Egg
  const keywords = ["coffee", "кофе", "чашка кофе", "cup of tea", "dragon", "дракон"];
  const checkItem = () => {
    return todos.some((el) => keywords.includes(el.title));
  };


  //Theme Change
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light-theme" && !checkItem() ? "dark-theme" :
      checkItem() ? "dragon-mode" :
        "light-theme");
  };

  //Adding new Item
  const addTodo = (title) => {
    const newTodo = { id: crypto.randomUUID(), title, completed: false };
    setTodos([...todos, newTodo]);

    if (checkItem()) {
      console.log("Dragon Mode On!🔥");
    }
  };

  //Checking Item
  const toggleTodo = (id, completed) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) return { ...todo, completed }
      return todo
    })
    )
  };

  //Deleting Item
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  //Clearing the List
  const clearList = () => {
    setTodos([])
  };


  //Filtering Tasks
  const filteredTasks = todos.filter((todo) =>
    filter === 'All' ? true :
      filter === 'Active' ? !todo.completed :
        filter === 'Completed' ? todo.completed :
          false
  );

  const todos_completed = filteredTasks.filter(
    (todo) => todo.completed === false
  ).length;

  return (
    <div className='container'>
      <div className="container-box">
        <div className="header">
          <h2>Todo App</h2>
          <label className="switch-btn" id="theme" >
            <input type='checkbox' onClick={toggleTheme} />
            <svg
              className='sun-btn'
              aria-hidden="true"
              viewBox="0 0 15 11"
              fill="none"
            >
            </svg>
          </label>
        </div>

        <div className='todo-app' id='todo'>
          <SubmitForm addTodo={addTodo} />
          <List
            todos={todos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            filteredTasks={filteredTasks}
          />

          {todos.length > 0 &&
            <div className='buttons-container'>
              <p><span className="todo-number">{todos_completed} {`${todos_completed > 1 ? "items" : "item"}`}</span> left</p>
              <div className="buttons choices">
                <button className='filter-btn' onClick={() => setFilter('All')}>All</button>
                <button className='filter-btn' onClick={() => setFilter('Active')}>Active</button>
                <button className='filter-btn' onClick={() => setFilter('Completed')}>Completed</button>
              </div>
              <button className='filter-btn' id='delete' onClick={clearList}>Clear Items</button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App