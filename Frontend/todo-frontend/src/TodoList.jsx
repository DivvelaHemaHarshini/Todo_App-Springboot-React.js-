import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [editingDescription, setEditingDescription] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = (status = filter) => {
        let params = {};

    if (status === "completed") {
        params.completed = true;
    } else if (status === "pending") {
        params.completed = false;
    }
        axios.get(API_URL,{params})
            .then(res => setTodos(res.data))
            .catch(err => console.error(err));
    };

    const addTodo = () => {
        if (!newTitle.trim()) return;

        axios.post(API_URL, {
            title: newTitle,
            description: newDescription,
            completed: false
        }).then(res => {
            setTodos([...todos, res.data]);
            setNewTitle("");
            setNewDescription("");
        });
    };

    const deleteTodo = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() =>
                setTodos(todos.filter(todo => todo.id !== id))
            );
    };

    const toggleComplete = (todo) => {
        axios.put(`${API_URL}/${todo.id}`, {
            ...todo,
            completed: !todo.completed
        }).then(res => {
            setTodos(todos.map(t =>
                t.id === todo.id ? res.data : t
            ));
        });
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditingText(todo.title);
        setEditingDescription(todo.description || "");
    };

    const saveEdit = (todo) => {
        axios.put(`${API_URL}/${todo.id}`, {
            ...todo,
            title: editingText,
            description: editingDescription
        }).then(res => {
            setTodos(todos.map(t =>
                t.id === todo.id ? res.data : t
            ));
            setEditingId(null);
        });
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.heading}><b>Todo Application</b></h2>
                <h4><i>Turn Plans into Progress</i></h4>

            
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Enter title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Enter description..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        style={styles.input}
                    />

                    <button onClick={addTodo} style={styles.addButton}>
                        Add Task
                    </button>
                </div>
                <div style={styles.filterContainer}>
    <button
        onClick={() => {
            setFilter("all");
            fetchTodos("all");
        }}
        style={filter === "all" ? styles.activeFilter : styles.filterButton}
    >
        All
    </button>

    <button
        onClick={() => {
            setFilter("completed");
            fetchTodos("completed");
        }}
        style={filter === "completed" ? styles.activeFilter : styles.filterButton}
    >
        Completed
    </button>

    <button
        onClick={() => {
            setFilter("pending");
            fetchTodos("pending");
        }}
        style={filter === "pending" ? styles.activeFilter : styles.filterButton}
    >
        Pending
    </button>
</div>

                
                <ul style={styles.list}>
                    {todos.map(todo => (
                        <li key={todo.id} style={styles.todoItem}>
                            {editingId === todo.id ? (
                                <>
                                    <input
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        style={styles.input}
                                    />

                                    <input
                                        value={editingDescription}
                                        onChange={(e) => setEditingDescription(e.target.value)}
                                        style={styles.input}
                                    />

                                    <div style={styles.buttonGroup}>
                                        <button onClick={() => saveEdit(todo)} style={styles.saveButton}>
                                            Save
                                        </button>
                                        <button onClick={() => setEditingId(null)} style={styles.cancelButton}>
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={styles.todoLeft}>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo)}
                                        />

                                        <div>
                                            <div style={{
                                                ...styles.title,
                                                textDecoration: todo.completed ? "line-through" : "none"
                                            }}>
                                                {todo.title}
                                            </div>

                                            <div style={styles.description}>
                                                {todo.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.buttonGroup}>
                                        <button onClick={() => startEdit(todo)} style={styles.editButton}>
                                            Edit
                                        </button>
                                        <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const styles = {
   page: {
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",   
    paddingTop: "40px",         
    fontFamily: "Segoe UI, sans-serif",
    overflowX: "hidden",
    overflowY:"hidden"      
},

    card: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        width: "50vw",
        hight:"50vh",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px"
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px"
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px"
    },
    addButton: {
        padding: "10px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
    },
    list: {
        listStyle: "none",
        padding: 0
    },
    todoItem: {
        background: "#f9fafb",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    todoLeft: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: "16px"
    },
    description: {
        fontSize: "13px",
        color: "#555"
    },
    buttonGroup: {
        display: "flex",
        gap: "6px"
    },
    editButton: {
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "5px",
        cursor: "pointer"
    },
    deleteButton: {
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "5px",
        cursor: "pointer"
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "5px",
        cursor: "pointer"
    },
    cancelButton: {
        backgroundColor: "#9e9e9e",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "5px",
        cursor: "pointer"
    },
    filterContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
},

filterButton: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    cursor: "pointer"
},

activeFilter: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #4CAF50",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer"
},

};

export default TodoList;
