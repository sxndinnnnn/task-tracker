// 1. Select DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');
const clearBtn = document.getElementById('clear-btn'); // NEW

// 2. Initialize State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. Functions
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressFill.style.width = `${percent}%`;
    progressText.innerText = `${percent}%`;

    // Logic to show/hide empty message and Clear button
    if (tasks.length === 0) {
        emptyMsg.classList.remove('hidden');
        clearBtn.classList.add('hidden'); // Hide clear btn if empty
    } else {
        emptyMsg.classList.add('hidden');
        clearBtn.classList.remove('hidden'); // Show clear btn if tasks exist
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-content" onclick="toggleTask(${index})">
                <div class="custom-checkbox">
                    ${task.completed ? '✓' : ''}
                </div>
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">&times;</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text: text, completed: false });
    taskInput.value = '';
    saveTasks();
}

// Global functions for inline onclicks
window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
}

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
}

// NEW: Clear All Logic
clearBtn.addEventListener('click', () => {
    // Simple confirmation to prevent accidents
    const confirmClear = confirm("Are you sure you want to delete all tasks?");
    if (confirmClear) {
        tasks = []; // Empty the array
        saveTasks(); // Save and re-render
    }
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// 4. Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// 5. Initial Render
renderTasks();
updateStats();