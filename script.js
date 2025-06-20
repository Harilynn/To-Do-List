const taskListEl = document.getElementById('taskList');
const addBtn = document.getElementById('addTaskBtn');
const txt = document.getElementById('newTaskText');
const prio = document.getElementById('newTaskPriority');
const filters = document.querySelectorAll('.filter');
let tasks = [];
let filter = 'all';

function render() {
  taskListEl.innerHTML = '';
  const emptyMessage = document.getElementById('emptyMessage');

  const visible = tasks.filter(t => filter === 'all' || t.done === (filter === 'completed'));

  if (visible.length === 0) {
    if (filter === 'all') {
      emptyMessage.textContent = 'No task added yet';
    } else if (filter === 'active') {
      emptyMessage.textContent = 'No active task left';
    } else {
      emptyMessage.textContent = 'No task completed yet';
    }
  } else {
    emptyMessage.textContent = '';
    visible.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.done ? ' completed' : '');
    li.style.animationDelay = `${i * 60}ms`;

    li.innerHTML = `
    <input type="checkbox" class="checkbox"${t.done ? ' checked' : ''} data-i="${i}">
    <div class="priority-dot priority-${t.priority}"></div>
    <div class="text">${t.text}</div>
    <div class="badge ${t.priority}">${t.priority}</div>
    <div class="actions">
      <button data-i="${i}" class="edit">✎</button>
      <button data-i="${i}" class="del">🗑</button>
    </div>
  `;
   li.classList.add('animated-item');
   setTimeout(() => li.classList.remove('animated-item'), 300);

   taskListEl.appendChild(li);
});

  }

  updateProgress();
}


function updateProgress() {
  const done = tasks.filter(t=>t.done).length;
  const total = tasks.length;
  const bar = document.querySelector('.bar-fill');
  const count = document.querySelector('.count');
  bar.style.width = total ? (done/total*100)+'%' : '0%';
  count.textContent = `${done}/${total} tasks completed`;
}

addBtn.addEventListener('click', addTask);
txt.addEventListener('keypress', e=> e.key==='Enter' && addTask());
filters.forEach(b=> b.addEventListener('click', e=>{
  filters.forEach(x=>x.classList.remove('active'));
  e.target.classList.add('active');
  filter = e.target.dataset.filter;
  render();
}));

function addTask(){
  const t = txt.value.trim(); if(!t) return;
  tasks.push({text:t,priority:prio.value,done:false});
  txt.value=''; render();
}

taskListEl.addEventListener('click', e=>{
  const i = e.target.dataset.i;
  if(e.target.classList.contains('del')) {
    tasks.splice(i,1); render();
  } else if(e.target.classList.contains('edit')) {
    const newText = prompt('Edit task', tasks[i].text);
    if(newText!==null) { tasks[i].text=newText.trim(); render(); }
  } else if(e.target.classList.contains('checkbox')) {
    tasks[i].done = e.target.checked; render();
  }
});

render();
