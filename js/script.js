let tasks = [];
let editId = null;

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const showCompletedBtn = document.getElementById("showCompletedBtn");
const showPendingBtn = document.getElementById("showPendingBtn");
const showAllBtn = document.getElementById("showAllBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const taskList = document.getElementById("taskList");

// Tambah atau update task
function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const errorMessage = document.getElementById("errorMessage");

  if (!taskText) {
    errorMessage.textContent = "Task tidak boleh kosong!";
    errorMessage.classList.remove("hidden");
    return;
  } else {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
  }

  if (editId) {
    tasks = tasks.map((task) =>
      task.id === editId ? { ...task, text: taskText, dueDate } : task
    );
    editId = null;
  } else {
    const newTask = {
      id: Date.now(),
      text: taskText,
      dueDate,
      completed: false,
    };
    tasks.push(newTask);
  }

  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
}

// Tampilkan daftar task
function renderTasks(filter = "all") {
  const taskBody = document.getElementById("taskBody");
  taskBody.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (filter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  if (filteredTasks.length === 0) {
    taskBody.innerHTML = `
      <tr class="bg-indigo-800">
        <td colspan="4" class="text-center py-6 text-indigo-100 font-semibold">No task found</td>
      </tr>
    `;
    return;
  }

  filteredTasks.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "bg-indigo-600 border-b border-indigo-800";

    row.innerHTML = `
      <td class="px-3 py-4 text-left align-middle ${
        task.completed ? "line-through text-gray-400" : "text-white"
      }">${task.text}</td>
      <td class="px-3 py-4 text-gray-100 align-middle">${
        task.dueDate || "-"
      }</td>
      <td class="px-3 py-4 text-left align-middle">
        <span class="px-3 py-1 text-xs font-medium rounded-full ${
          task.completed
            ? "bg-green-600 text-white"
            : "bg-yellow-600 text-white"
        }">${task.completed ? "Completed" : "Pending"}</span>
      </td>
      <td class="px-3 py-4 text-left align-middle">
        <div class="flex gap-2">
          <button onclick="toggleComplete(${task.id})"
            class="text-xs bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white transition">
            ${task.completed ? "Undo" : "Done"}
          </button>
          <button onclick="editTask(${task.id})"
            class="text-xs bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-black transition">
            Edit
          </button>
          <button onclick="deleteTask(${task.id})"
            class="text-xs bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition">
            Delete
          </button>
        </div>
      </td>
    `;
    taskBody.appendChild(row);
  });
}

// Tandai selesai / batal
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

// Edit task
function editTask(id) {
  const taskToEdit = tasks.find((task) => task.id === id);
  if (taskToEdit) {
    taskInput.value = taskToEdit.text;
    dueDateInput.value = taskToEdit.dueDate;
    editId = id;
  }
}

// Hapus task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

// Tampilkan dialog konfirmasi hapus semua
deleteAllBtn.addEventListener("click", () => {
  const confirmBox = document.getElementById("confirmDelete");
  confirmBox.classList.remove("hidden");
});

// Konfirmasi Hapus Semua Task
document.getElementById("confirmYes").addEventListener("click", () => {
  tasks = [];
  renderTasks();
  document.getElementById("confirmDelete").classList.add("hidden");
});

document.getElementById("confirmNo").addEventListener("click", () => {
  document.getElementById("confirmDelete").classList.add("hidden");
});

// Filter
showCompletedBtn.addEventListener("click", () => renderTasks("completed"));
showPendingBtn.addEventListener("click", () => renderTasks("pending"));
showAllBtn.addEventListener("click", () => renderTasks("all"));

// Tambah task
addTaskBtn.addEventListener("click", addTask);

// Tampilkan task awal
renderTasks();
