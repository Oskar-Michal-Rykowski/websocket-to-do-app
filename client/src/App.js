import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
    };
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (tasks) => {
      this.updateTasks(tasks);
    });
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id);
    });
  }

  removeTask(id, local) {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    });
    if (local) {
      this.socket.emit('removeTask', id);
    }
  }

  updateTask(newTaskName) {
    this.setState({
      taskName: newTaskName,
    });
  }

  addTask(newTask) {
    this.setState({ tasks: [...this.state.tasks, newTask] });
  }

  submitForm(e) {
    e.preventDefault();
    const newTask = { name: this.state.taskName, id: uuidv4() };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({ taskName: '' });
  }

  updateTasks(taskslist) {
    this.setState({ tasks: taskslist });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li className="task" key={task.id}>
                {task.name}{' '}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id, true)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              onChange={(e) => this.updateTask(e.currentTarget.value)}
              value={taskName}
            />
            <button
              className="btn"
              type="submit"
              onClick={(e) => this.submitForm(e)}
            >
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
