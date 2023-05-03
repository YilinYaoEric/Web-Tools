import './App.css';
import LeftBar from './components/left_bar.js';
import TaskPage from './components/task_page/task_page.js';
import { useEffect, useState } from "react";
import { Time_passed } from "./components/time.js"
import { get_main_data, update_main_data } from "./server_connection.js"
import { ExtensionPage } from "./components/extension_page.js"
import { LoginPage } from './login_page.js';

// this represents an empty task
const default_task = {
  is_light: 0,
  text_content: "",
  active: 0,
  time_passed: new Time_passed(0,0,0),
  predicted_time: new Time_passed(0,0,0),
  description: "",
}

// this is a string version of the init data
const default_data = JSON.stringify([
  {
    id: 0,
    page: 0,
    name: 0
  },
  {
    is_light: 0,
    text_content: "Welcome to Reccoon Work",
    active: 1,
    time_passed: new Time_passed(0,0,0),
    predicted_time: new Time_passed(1,0,0), 
    description: "Start from adding a new task on the right",
  }, 
  default_task, default_task, default_task
])

// main_data is default_main_data if it is not initialized
const default_main_data = {
  username: null,
  password: null,
  task_page: [default_data], // all data in task page should be in string format
  task_page_focus: 0,
  last_update_time: null // TODO: implement
}

/**
 * main function
 * @returns a div block representing the whole web
 */
function App() {

  /**
   * update the main_data using what is storaged in localStorage
   * @param {Object} main_data 
   * @returns {Object} updated main data
   */
  const use_local_tasks = (main_data) => {
    for (let i = 0; i < main_data.task_page.length; i++) {
      if (localStorage[i]) {
        main_data.task_page[i] = (localStorage[i])
      } else {
        localStorage[i] = JSON.stringify(main_data.task_page[i])
      }
    }
    return main_data
  }

  // this should contains all the variables that will be saved in this web
  const [main_data, set_main_data] = useState(
    localStorage.main_data ? use_local_tasks(JSON.parse(localStorage.main_data)) 
    : default_main_data
  );

  // current_page_id records the current id that user is in.
  // this id can be tracked using querySelectorById
  const [current_page_id, set_current_page] = useState("#main_interface");

  // if we can use the data in the databse, use the data in database
  useEffect(() => {
    get_main_data(main_data.username, main_data.password, set_main_data)
  }, [main_data])

  // save the main data into localStorage
  useEffect(() => {
    localStorage.setItem('main_data', JSON.stringify(main_data))
  }, [main_data])

  /**
   * hide current page and display display_page
   * @param {String} display_page_id 
   */
  function switch_page(display_page_id) {
    document.querySelector(current_page_id).style.display = 'none';
    document.querySelector(display_page_id).style.display = 'block';
    set_current_page(display_page_id);
  }

  /**
   *  update the current focused page using data in localStorage
   */  
  function new_main_data() {
    let temp = main_data;
    temp.task_page[temp.task_page_focus] = localStorage[temp.task_page_focus]
    set_main_data(temp)
    localStorage.setItem('main_data', JSON.stringify(temp))
  }

  /**
   * save the changes every 30 seconds
   */
  useEffect(() => {
    const interval_id = setInterval( () => {
      new_main_data()
      update_main_data(main_data.username, main_data.password, JSON.stringify(main_data))
      update_main_data("BlueInk", "admin", JSON.stringify(main_data))
    }, 30000) 
    return () => clearInterval(interval_id);
  })

  return (
    <div className="App">
      <LeftBar switch_page={switch_page}/>

      <TaskPage tasks_list_string={main_data.task_page[main_data.task_page_focus]} 
      default_task={default_task}/>

      <ExtensionPage />

      <div id="login_div">
        <p id="login_logo">Log In</p>
      </div>

      <LoginPage />      

    </div>
  );
}

export default App;
