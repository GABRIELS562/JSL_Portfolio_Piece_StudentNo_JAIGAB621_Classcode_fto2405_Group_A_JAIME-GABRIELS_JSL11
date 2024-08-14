import {
    getTasks,
    createNewTask,
    patchTask,
    putTask,
    deleteTask,
  } from "./utils/taskFunctions.js";
  // TASK: import initialData
  import { initialData } from "./initialData.js";

function intializeData () {
if (!localStorage.getItem("tasks")) 
    localStorage.setItem("tasks", JSON.stringify(initialData));
 } else {
    console.log("Data already exists in localStorage");
}

