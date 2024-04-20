import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [task, setTask] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Error fetching todos. Please try again.');
        }
    };

    const handleAddTodo = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/todos', {
                task,
                completed: false,
            });
            setTodos([...todos, response.data]);
            setTask('');
        } catch (error) {
            console.error('Error adding todo:', error);
            setError('Error adding todo. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Error deleting todo. Please try again.');
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setShowEditModal(true);
    };

    const handleUpdateTodo = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/api/todos/${editingTodo._id}`, {
                task: editingTodo.task,
                completed: editingTodo.completed,
            });
            setTodos(todos.map(todo => (todo._id === editingTodo._id ? response.data : todo)));
            setEditingTodo(null);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Error updating todo. Please try again.');
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col className="text-center">
                    <h1 className="display-4">TODO App</h1>
                </Col>
            </Row>
            {error && <p className="text-danger">{error}</p>}
            <Row className="my-3">
                <Col md={6} className="mx-auto">
                    <Form>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter task"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="rounded-0"
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="rounded-0 w-100"  // Use the w-100 class to make the button full-width (equivalent to block)
                            onClick={handleAddTodo}
                        >
                            Add Todo
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className="my-3">
                <Col md={8} className="mx-auto">
                    <Table striped bordered hover responsive className="rounded-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo, index) => (
                                <tr key={todo._id}>
                                    <td>{index + 1}</td>
                                    <td>{todo.task}</td>
                                    <td>
                                        <Badge
                                            variant={todo.completed ? 'success' : 'warning'}
                                            className="todo-status-badge"
                                        >
                                            {todo.completed ? 'Completed' : 'Pending'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant="info"
                                            className="mx-2"
                                            onClick={() => handleEdit(todo)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(todo._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter updated task"
                                value={editingTodo?.task}
                                onChange={(e) =>
                                    setEditingTodo({ ...editingTodo, task: e.target.value })
                                }
                                className="rounded-0"
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="rounded-0 w-100"  // Use the w-100 class to make the button full-width (equivalent to block)
                            onClick={handleUpdateTodo}
                        >
                            Update Todo
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default App;