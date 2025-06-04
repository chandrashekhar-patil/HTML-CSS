// Simulated RESTful API using localStorage
const STORAGE_KEY = 'tasks';

function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(task) {
  const tasks = getTasks();
  task.id = Date.now();
  tasks.push(task);
  saveTasks(tasks);
}

function updateTask(updatedTask) {
  const tasks = getTasks().map(task => task.id === updatedTask.id ? updatedTask : task);
  saveTasks(tasks);
}

function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  saveTasks(tasks);
}

function getTaskById(id) {
  return getTasks().find(task => task.id === id);
}

function renderTaskList() {
  const app = document.querySelector('#app');
  const tasks = getTasks();
  app.innerHTML = '<h2>Task List</h2>' +
    tasks.map(task => `
      <div class="task-card">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <small>Due: ${task.dueDate}</small><br>
        <button onclick="navigate('/view/${task.id}')">View</button>
        <button onclick="navigate('/edit/${task.id}')">Edit</button>
        <button onclick="handleDelete(${task.id})">Delete</button>
      </div>`).join('');
}

function renderTaskForm(task = {}) {
  const isEdit = !!task.id;
  document.querySelector('#app').innerHTML = `
    <h2>${isEdit ? 'Edit' : 'Add'} Task</h2>
    <form onsubmit="handleFormSubmit(event, ${isEdit})">
      <input type="hidden" name="id" value="${task.id || ''}" />
      <input type="text" name="title" placeholder="Title" value="${task.title || ''}" required />
      <textarea name="description" placeholder="Description" required>${task.description || ''}</textarea>
      <input type="date" name="dueDate" value="${task.dueDate || ''}" required />
      <button type="submit">${isEdit ? 'Update' : 'Add'} Task</button>
    </form>
  `;
}

function renderTaskDetail(id) {
  const task = getTaskById(id);
  if (!task) return navigate('/');
  document.querySelector('#app').innerHTML = `
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <p>Due: ${task.dueDate}</p>
    <button onclick="navigate('/')">Back</button>
  `;
}

function handleFormSubmit(event, isEdit) {
  event.preventDefault();
  const form = event.target;
  const task = {
    id: isEdit ? parseInt(form.querySelector('input[name="id"]').value) : undefined,
    title: form.querySelector('input[name="title"]').value,
    description: form.querySelector('textarea[name="description"]').value,
    dueDate: form.querySelector('input[name="dueDate"]').value
  };
  isEdit ? updateTask(task) : createTask(task);
  navigate('/');
}

function handleDelete(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(id);
    renderTaskList();
  }
}

function navigate(path) {
  history.pushState({}, '', path);
  router();
}

function router() {
  const path = location.pathname;
  if (path === '/' || path === '/index.html') renderTaskList();
  else if (path === '/add') renderTaskForm();
  else if (path.startsWith('/edit/')) {
    const id = parseInt(path.split('/')[2]);
    renderTaskForm(getTaskById(id));
  } else if (path.startsWith('/view/')) {
    const id = parseInt(path.split('/')[2]);
    renderTaskDetail(id);
  } else {
    document.querySelector('#app').innerHTML = '<h2>404 - Not Found</h2>';
  }
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);
