// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeIcon.classList.toggle('bi-moon-stars');
    themeIcon.classList.toggle('bi-sun');
});

// Task Manager
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = [];

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
    updateProductivityChart();
});

function addTask(taskText) {
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(task);
    renderTask(task);
}

function renderTask(task) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
        <span class="${task.completed ? 'task-completed' : ''}">${task.text}</span>
        <div>
            <button class="complete-btn btn btn-icon btn-outline-success me-2" title="Mark as completed">
                <i class="bi bi-check"></i>
            </button>
            <button class="delete-btn btn btn-icon btn-outline-danger" title="Delete task">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    
    taskList.appendChild(li);
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderTasks();
    updateProductivityChart();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
    updateProductivityChart();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(renderTask);
}

// Goal Setting
const goalInput = document.getElementById('goal-input');
const setGoalBtn = document.getElementById('set-goal');
const goalDisplay = document.getElementById('goal-display');
let dailyGoal = 5;

setGoalBtn.addEventListener('click', () => {
    dailyGoal = parseInt(goalInput.value);
    goalDisplay.textContent = `Current Goal: ${dailyGoal} tasks`;
    updateProductivityChart();
});

// Pomodoro Timer
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');

let timer;
let timeLeft = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(timer);
                isRunning = false;
            }
        }, 1000);
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// Productivity Chart
const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

function updateProductivityChart() {
    const completedTasks = tasks.filter(t => t.completed).length;
    const remainingTasks = dailyGoal - completedTasks;
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                label: 'Tasks',
                data: [completedTasks, remainingTasks],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.6)',
                    'rgba(220, 53, 69, 0.6)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: dailyGoal
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Initial render
updateTimerDisplay();
updateProductivityChart();
