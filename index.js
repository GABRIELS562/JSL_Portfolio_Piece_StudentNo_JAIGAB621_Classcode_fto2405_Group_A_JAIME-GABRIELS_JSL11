// TASK: import helper functions from utils
// The import statement is used to bring in modules or data from other files into the current script
import {
  getTasks,
  createNewTask,
  patchTask,
  putTask,
  deleteTask,
} from "./utils/taskFunctions.js";
// TASK: import initialData
import { initialData } from "./initialData.js";

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  //the initializeData function is designed to check if the tasks data is already stored in localStorage. If it isn’t, the function will store the initial data.

  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData)); // Store the initial data in localStorage
    localStorage.setItem("showSideBar", "true"); //The setItem method is used again to store a string value 'true' under the key showSideBar.
  } else {
    console.log("Data already exists in localStorage");
  }
}

//initializeData();

// TASK: Get elements from the DOM
//
const elements = {
  sideBar: document.getElementById("side-bar-div"),
  boardsNavLinksDiv: document.getElementById("boards-nav-links-div"),
  toggleTheme: document.getElementById("switch"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  headerBoardName: document.getElementById("header-board-name"),
  dropdownBtn: document.getElementById("dropdownBtn"),
  addNewTaskBtn: document.getElementById("add-new-task-btn"),
  editBoardBtn: document.getElementById("edit-board-btn"),
  deleteBoardBtn: document.getElementById("deleteBoardBtn"),
  tasksContainers: document.querySelectorAll(".tasks-container"), // Select all tasks containers
  columnDivs: document.querySelectorAll(".column-div"), // Select all column divs
  newTaskModalWindow: document.getElementById("new-task-modal-window"),
  editTaskModalWindow: document.querySelector(".edit-task-modal-window"),
  modalWindow: document.querySelector(".modal-window"), // Select the modal window
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

let activeBoard = "";

//Extracts unique board names from tasks
//TASK: FIX BUGS
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard ? localStorageBoard : boards[0]; /// replaced ; with :
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard); // adds active class to active board
    refreshTasksUI(); //he refreshTasksUI function likely filters tasks based on the active board and updates the task list or grid to show only the relevant tasks.
  }
}

// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div"); // Select the boards container in HTML file
  boardsContainer.innerHTML = ""; // Clears the container

  boards.forEach((board) => {
    // this line starts a loop that iterates over each element in the boards array. For each iteration, the current board name is stored in the board variable.
    const boardElement = document.createElement("button");
    boardElement.textContent = board; //the text content of the boardElement (the button) is set to the current board’s name.
    boardElement.classList.add("board-btn"); // Adds a class of "board-btn" to the boardElement, for styling

    boardElement.addEventListener("click", () => {
      // Added eventlistener for click to update headerBoardName
      //Added eventlistener for click to update headerBoardName
      elements.headerBoardName.textContent = board; //When a board button is clicked, the textContent of the element identified by headerBoardName is updated to show the name of the clicked board. This visually indicates which board is currently active.
      filterAndDisplayTasksByBoard(board); // function is below and will be explained there
      activeBoard = board; //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard)); //The current active board’s name is saved to localStorage using the setItem method.
      styleActiveBoard(activeBoard); //function is below and will be explained there( Styling Applied)
    });

    boardsContainer.appendChild(boardElement); // Append Button to Container: boardsContainer
  });
}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks(); // Fetch tasks from a simulated local storage function
  const filteredTasks = tasks.filter((task) => task.board === boardName); // Added strict equality operator to filter ONLY tasks based on board name

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status"); //For each column, this line retrieves the value of the data-status attribute (e.g., “To Do,” “In Progress,” "Done"), and stores it in the status variable. This attribute likely defines what type of tasks should be displayed in that column.

    // Reset column content while preserving the column title
    column.innerHTML = `<div class="column-head-div">
                          <span class="dot" id="${status}-dot"></span>
                          <h4 class="columnHeader">${status.toUpperCase()}</h4>
                        </div>`; //The innerHTML of each column is set to a new structure. This effectively clears any existing tasks in the column but preserves and sets up the column title and status indicator.

    const tasksContainer = document.createElement("div"); //A new <div> element called tasksContainer is created. This container will hold the individual tasks for this column. The tasksContainer is then appended to the current column.

    column.appendChild(tasksContainer);

    filteredTasks //The filteredTasks array is further filtered to include only tasks whose status matches the status of the current column. The forEach method is then used to iterate over these filtered tasks.
      .filter((task) => task.status === status)
      .forEach((task) => {
        // Added strict equality operator to filter tasks based on status
        const taskElement = document.createElement("div"); //For each task, a new <div> element called taskElement is created. This div represents the task in the UI. The task’s title is set as the text content, and a CSS class task-div is added for styling. The task’s ID is also set as a data-task-id attribute, allowing it to be referenced later if needed.
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.setAttribute("data-task-id", task.id);

        // Listen for a click event on each task and open a modal
        taskElement.addEventListener("click", () => {
          //An event listener is added to each taskElement. When the task is clicked, the openEditTaskModal function is called with the task object as a parameter. This likely opens a modal window for editing the task. The modal window’s display style is also set to block, making it visible.

          openEditTaskModal(task);
          elements.editTaskModalWindow.style.display = "block";
        });

        tasksContainer.appendChild(taskElement); //Each taskElement (representing a task) is appended to the tasksContainer, which in turn is inside the respective column. This adds the task to the UI, making it visible under the correct status column.
      });
  });
}

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  //The function uses document.querySelectorAll(".board-btn") to select all elements in the document with the class board-btn. This returns a NodeList of button elements representing different boards.
  document.querySelectorAll(".board-btn").forEach((btn) => {
    //
    //Spelling of forEach fixed

    if (btn.textContent === boardName) {
      //For each button, the code checks if the button’s textContent (the text displayed on the button) matches boardName.
      btn.classList.add("active"); //This correctly adds the 'active' class to the button element.//
    } else {
      btn.classList.remove("active"); //This correctly removes the 'active' class to the button element.
    }
  }); //If the Text Matches: If the text of the button matches the boardName, the active class is added to the button using btn.classList.add("active"). This visually indicates that this button corresponds to the currently active board.
} //If the Text Doesn’t Match: If the text of the button does not match the boardName, the active class is removed from the button using btn.classList.remove("active"). This ensures that only the active board’s button is highlighted, and all others are reset to their default state.

function addTaskToUI(task) {
  const column = document.querySelector(
    //This line attempts to find a column in the UI that corresponds to the status of the task by using a CSS selector.
    '.column-div[data-status="${task.status}"]' //The data-status attribute of the column-div element is expected to match the task’s status.
  );
  if (!column) {
    console.error(`Column not found for status: ${task.status}`); //If no column is found for the given status (column is null or undefined), an error message is logged to the console.
    return;
  }

  let tasksContainer = column.querySelector(".tasks-container");
  if (!tasksContainer) {
    //The code attempts to find a tasks-container within the identified column. If it is not found, an error message is logged to the console.
    console.warn(
      `Tasks container not found for status: ${task.status}, creating one.`
    );
    tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks-container";
    column.appendChild(tasksContainer);
  }

  const taskElement = document.createElement("div");
  taskElement.className = "task-div";
  taskElement.textContent = task.title; // Modify as needed. The textContent is set to the task’s title, so the user can see what the task is about.
  taskElement.setAttribute("data-task-id", task.id); //The setAttribute method is used to add a data-task-id attribute, which stores the task’s unique identifier (id).

  tasksContainer.appendChild(taskElement); //Finally, the newly created taskElement is appended to the tasksContainer within the appropriate column.
}

function setupEventListeners() {
  //It does not take any parameters and is intended to be called once during the initialization of the application to set up all necessary event listeners.

  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn"); //
  cancelEditBtn.addEventListener("click", () => {
    ////An event listener is attached to the button, listening for a click event.
    toggleModal(false, elements.editTaskModal); //When clicked, the modal for editing a task (elements.editTaskModal) is closed by calling toggleModal(false, elements.editTaskModal).
    elements.filterDiv.style.display = "none"; //The filter overlay is also hidden by setting its display property to none.
  }); // corrected event listener

  // Cancel adding new task event listener> similar to previous function
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    //
    toggleModal(false);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", () => {
    toggleModal(false, elements.modalWindow);
    toggleModal(false, elements.editTaskModal);
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay
  });
  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => toggleSidebar(false)); //fixed event listener 	These buttons control the visibility of the sidebar.
  elements.showSideBarBtn.addEventListener("click", () => toggleSidebar(true)); // fixed event ListenerWhen hideSideBarBtn is clicked, the sidebar is hidden by calling toggleSidebar(false).
  //Conversely, when showSideBarBtn is clicked, the sidebar is shown by calling toggleSidebar(true).

  // Theme switch event listener
  elements.toggleTheme.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.addNewTaskBtn.addEventListener("click", () => {
    //When the theme switch is toggled (usually a checkbox or switch input), the toggleTheme function is called, changing the theme of the application.

    toggleModal(true);
    elements.filterDiv.style.display = "block"; // Also show the filter overlay, When the button is clicked, the modal for adding a new task is shown, and the filterDiv overlay is made visible.
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none"; //replaced function with tenary operator
}
//The toggleModal function is a concise way to control the visibility of modals within your application. By using the ternary operator, it efficiently toggles the modal’s display style based on the show boolean value, making the code more readable and compact.
/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); //Prevents the default behavior of the form submission, which is to refresh the page.

  //Assign user input to the task object
  const task = {
    status: document.getElementById("select-status").value, //Gets the value from the status select dropdown (select-status), representing the task’s status.
    title: document.getElementById("title-input").value, //Gets the value from the title input field (title-input), representing the task’s title.
    description: document.getElementById("desc-input").value, //Gets the value from the description input field (desc-input), representing the task’s description.
    board: activeBoard, //Uses the activeBoard variable to assign the current active board to the task.
  };
  const newTask = createNewTask(task); //should handle adding the task to a data store (e.g., localStorage) and return the newly created task object.
  if (newTask) {
    ////Checks if newTask is truthy (i.e., a task was successfully created)
    addTaskToUI(newTask); //Adds the newly created task to the UI by calling addTaskToUI with the newTask object.
    toggleModal(false); //Closes the modal window by calling toggleModal with false, hiding the modal where the task was added.
    elements.filterDiv.style.display = "none"; // Also hide the filter overlay This ensures the UI is clean after adding a task.
    event.target.reset(); //Resets the form fields to their initial state, clearing the input fields after submission.
    refreshTasksUI(); //Calls refreshTasksUI() to update the task display according to the latest data and state. This ensures the UI reflects any changes, such as new tasks or updated information.
  }
}

// Toggle the visibility of the sidebar

function toggleSidebar(show) {
  const sidebar = document.querySelector(".side-bar"); //Selects the sidebar element from the DOM using the class name "side-bar".
  sidebar.style.display = show ? "block" : "none"; //If show is true, the sidebar’s display style is set to "block", making it visible.
  elements.showSideBarBtn.style.display = show ? "none" : "block"; //If show is true, the showSideBarBtn button is hidden, and vice versa.
}

// Toggle between light and dark themes
function toggleTheme() { /
  // get logo from the DOM
  const logo = document.getElementById("logo");
  const isLightTheme = document.body.classList.toggle("light-theme");
  logo.setAttribute(
    "src",
    isLightTheme ? "./assets/newlogo2.png" : "./assets/newlogo2.png" //change picture to my own
  );
}
// Open the modal for editing a task
function openEditTaskModal(task) {
  // Set task details in modal inputs
  const title = document.getElementById("edit-task-title-input");
  const desc = document.getElementById("edit-task-desc-input");
  const status = document.getElementById("edit-select-status");

  title.value = task.title;
  desc.value = task.description;
  status.value = task.status;

  // Get button elements from the task modal
  const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  cancelEditBtn.addEventListener(
    "click",
    () => (elements.editTaskModalWindow.style.display = "none")
  );//To close or hide the edit task modal window when the cancel button is clicked.

  // Call saveTaskChanges upon click of Save Changes button
  saveTaskChangesBtn.addEventListener("click", function saveEdit() {
    saveTaskChanges(task.id);
    elements.editTaskModalWindow.style.display = "none";
    elements.newTaskModalWindow.style.display = "none";
    saveTaskChangesBtn.removeEventListener("click", saveEdit);
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener("click", function deleteEdit() {
    deleteTask(task.id);
    elements.editTaskModalWindow.style.display = "none"; //Hides the edit task modal window by setting its style.display property to "none".
    elements.newTaskModalWindow.style.display = "none";//Hides the new task modal window (if it’s open) by setting its style.display property to "none".
    refreshTasksUI();//Calls the refreshTasksUI function to update the user interface, typically to reflect the changes made after deleting the task.
    deleteTaskBtn.removeEventListener("click", deleteEdit);//Removes the deleteEdit event listener from deleteTaskBtn.
  });

  toggleModal(true, elements.editTaskModal); // SThis line is used to ensure that the edit task modal is displayed, allowing the user to interact with it.

}

function saveTaskChanges(taskId) {
  // Get new user inputs
  // Create an object with the updated task details
  const updatedTask = {
    title: elements.editTaskTitleInput.value,
    description: elements.editTaskDescInput.value,
    status: elements.editSelectStatus.value,
    board: activeBoard,
  };

  // Update task using a helper function
  putTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  elements.editTaskModalWindow.style.display = "none";

  refreshTasksUI();
}

/*************************************************************************************************************************************************/
// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  //The "DOMContentLoaded" event is fired when the HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
  initializeData(); //This function typically initializes or sets up any necessary data, such as setting initial values in localStorage, if not already present.
  init(); // init is called after the DOM is fully loaded ( function Below )
});

function init() {
  setupEventListeners(); //	It sets up various event listeners throughout the application, such as handling clicks, form submissions, and other user interactions.
  const showSidebar = localStorage.getItem("showSideBar") === "true"; //This determines whether the sidebar should be shown or hidden based on the user’s previous state.
  toggleSidebar(showSidebar); //If showSidebar is true, the sidebar will be shown; if false, it will be hidden.
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme); //This determines whether the light theme should be applied based on the user’s previous choice.
  fetchAndDisplayBoardsAndTasks(); // This function retrieves tasks and boards from localStorage and displays them on the UI.
}
