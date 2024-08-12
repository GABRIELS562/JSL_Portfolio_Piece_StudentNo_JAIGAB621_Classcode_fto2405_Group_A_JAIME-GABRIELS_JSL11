
// TASK: import helper functions from utils
import { getTasks, createNewTask, patchTask, putTask, deleteTask } from './utils/taskFunctions.js'
// TASK: import initialData
import { initialData } from './initialData.js'




/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}

//initializeData();



// TASK: Get elements from the DOM
const elements = {
  sideBar: document.getElementById("side-bar-div"),
  boardsNavLinksDiv: document.getElementById("boards-nav-links-div"),
  themeSwitch: document.getElementById("switch"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  headerBoardName: document.getElementById("header-board-name"),
  dropdownBtn: document.getElementById("dropdownBtn"),
  addNewTaskBtn: document.getElementById("add-new-task-btn"),
  editBoardBtn: document.getElementById("edit-board-btn"),
  deleteBoardBtn: document.getElementById("deleteBoardBtn"),
  tasksContainers: document.querySelectorAll(".tasks-container"),
  columnDivs: document.querySelectorAll(".column-div"),
  newTaskModalWindow: document.getElementById("new-task-modal-window"),
  editTaskModalWindow: document.querySelector(".edit-task-modal-window"),
  modalWindow: document.querySelector(".modal-window"),
  titleInput: document.getElementById("title-input"),
  descInput: document.getElementById("desc-input"),
  selectStatus: document.getElementById("select-status"),
  createTaskBtn: document.getElementById("create-task-btn"),
  cancelAddTaskBtn: document.getElementById("cancel-add-task-btn"),
  editTaskForm: document.getElementById("edit-task-form"),
  editTaskTitleInput: document.getElementById("edit-task-title-input"),
  editTaskDescInput: document.getElementById("edit-task-desc-input"),
  editSelectStatus: document.getElementById("edit-select-status"),
  saveTaskChangesBtn: document.getElementById("save-task-changes-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  deleteTaskBtn: document.getElementById("delete-task-btn"),
  filterDiv: document.getElementById("filterDiv"),
};



let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; /// replaced ; with :
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container

  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");

    boardElement.addEventListener("click", () => { //Added eventlistener for click to update headerBoardName
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
    });

    boardsContainer.appendChild(boardElement);
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter(task => task.board === boardName); // Added strict equality operator to filter tasks based on board name

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");

    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

    filteredTasks.filter(task => task.status === status).forEach(task => {  // Added strict equality operator to filter tasks based on status
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-div");
      taskElement.textContent = task.title;
      taskElement.setAttribute('data-task-id', task.id);

      // Listen for a click event on each task and open a modal
      taskElement.addEventListener("click",() => { // Added eventlistener for click
        openEditTaskModal(task);
      });

      tasksContainer.appendChild(taskElement);
    });
  });
}


function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll('.board-btn').forEach(btn => { //Spelling of forEach fixed 
    
    if(btn.textContent === boardName) {
      btn.classList.add('active') //This correctly adds the 'active' class to the button element.
    }
    else {
      btn.classList.remove('active'); //This correctly removes the 'active' class to the button element.
    }
  });
}


function addTaskToUI(task) {
  const column = document.querySelector('.column-div[data-status="${task.status}"]'); 
  if (!column) {
    console.error(`Column not found for status: ${task.status}`);
    return;
  }

  let tasksContainer = column.querySelector('.tasks-container');
  if (!tasksContainer) {
    console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
    tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks-container';
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task-div';
  taskElement.textContent = task.title; // Modify as needed
  taskElement.setAttribute('data-task-id', task.id);
  
  tasksContainer.appendChild(); 
}



function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener("click", () => toggleModal(false, elements.editTaskModal)); //corrected event listener

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false)); //fixed event listener
  elements.showSideBarBtn.addEventListener("click",() => toggleSidebar(true)); // fixed event Listener

  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? 'block' : 'none'; //replaced function with tenary operator
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 

  //Assign user input to the task object
    const task = 
    {id: Date.now(), // Unique identifier for the task
      title: document.getElementById('title-input').value, // Input with id 'title-input'
      description: document.getElementById('desc-input').value, // Textarea with id 'desc-input'
      board: activeBoard, // Use the currently active board
      status: document.getElementById('select-status').value, // Select dropdown with id 'select-status'
    };

      
    };
    const newTask = createNewTask(task);
    if (newTask) {
      addTaskToUI(newTask);
      toggleModal(false);
      elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
      event.target.reset();
      refreshTasksUI();
    }





  function toggleSidebar(show) {
    const sidebar = document.getElementById('side-bar-div');
    const showSidebarBtn = document.getElementById('show-side-bar-btn');
  
    if (show) {
      sidebar.style.display = 'block';
      showSidebarBtn.style.display = 'none';
    } else {
      sidebar.style.display = 'none';
      showSidebarBtn.style.display = 'block';
    }
  
    localStorage.setItem('showSideBar', show); // Store sidebar state in localStorage
  }
 


  function toggleTheme() {
    const isLightTheme = document.body.classList.toggle('light-theme');
    
    if (isLightTheme) {
      localStorage.setItem('light-theme', 'enabled');
    } else {
      localStorage.setItem('light-theme', 'disabled');
    }
  }


  function openEditTaskModal(task) {
    // Set task details in modal inputs
    document.getElementById('edit-task-title-input').value = task.title;
    document.getElementById('edit-task-desc-input').value = task.description;
    document.getElementById('edit-select-status').value = task.status;
  
    // Get button elements from the task modal
    const saveBtn = document.getElementById('save-task-changes-btn');
    const deleteBtn = document.getElementById('delete-task-btn');
  
    // Call saveTaskChanges upon click of Save Changes button
    saveBtn.onclick = () => saveTaskChanges(task.id);
  
    // Delete task using a helper function and close the task modal
    deleteBtn.onclick = () => {
      deleteTask(task.id); // Implement this function to delete the task
      toggleModal(false, elements.editTaskModal);
      refreshTasksUI();
    };
  

    toggleModal(true, elements.editTaskModal); // Show the edit task modal
  }
  // Set task details in modal inputs
  

  // Get button elements from the task modal


  // Call saveTaskChanges upon click of Save Changes button
 

  // Delete task using a helper function and close the task modal


  toggleModal(true, elements.editTaskModal); // Show the edit task modal


function saveTaskChanges(taskId) {
  // Get new user inputs
  const updatedTitle = document.getElementById('edit-task-title-input').value;
  const updatedDescription = document.getElementById('edit-task-desc-input').value;
  const updatedStatus = document.getElementById('edit-select-status').value;

  // Create an object with the updated task details
  const updatedTask = {
    id: taskId,
    title: updatedTitle,
    description: updatedDescription,
    board: activeBoard,
    status: updatedStatus,
  };

  // Update task using a helper function
  updateTaskInLocalStorage(updatedTask); // Implement this function to update the task in localStorage

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);
  refreshTasksUI();
}
  // Get new user inputs
  

  // Create an object with the updated task details


  // Update task using a hlper functoin
 

  // Close the modal and refresh the UI to reflect the changes

  refreshTasksUI();



/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem('light-theme') === 'enabled';
  document.body.classList.toggle('light-theme', isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}