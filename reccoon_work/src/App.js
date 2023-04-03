import './App.css';
import LeftBar from './components/left_bar.js';
import TaskPage from './components/task_page/task_page.js';
import { useState } from "react";

function App() {
  const [current_page_id, set_current_page] = useState("#main_interface");

  // hide current page and display display_page
  function switch_page(display_page_id) {
    document.querySelector(current_page_id).style.display = 'none';
    document.querySelector(display_page_id).style.display = 'block';
    set_current_page(display_page_id);
  }

  return (
    <div className="App">
      <LeftBar switch_page={switch_page}/>

      <TaskPage />

      <div id="extension_page">

        <div id="add_extension">
          <p id="extensions_text">Extensions</p>
          <form action="/action_page.php" id="search_extension_form">
            <label htmlFor="search_extension"></label>
            <textarea id="search_extension" name="search_extension" placeholder="Search Extensions"></textarea>
          </form>
          <div id="extensions">

          </div>
        </div>
        <div id="common_settings">
          <p id="common_settings_text">Commonly Used Settings</p>
          <div id="settings">

          </div>
        </div>
      </div>

      <div id="login_div">
        <p id="login_logo">Log In</p>
      </div>

      <div id="login_page">
        <div id="user_info_input">
          <form action="/action_page.php" id="search_">
            <label htmlFor="username"></label>
            <textarea id="username" name="username" placeholder="Username: " className="textbox"></textarea>
            <textarea id="password" name="password" placeholder="Password: " className="textbox"></textarea>
          </form>
          <button type="button" id="login" className="button placeholder_text">Login</button>
          <button type="button" id="create_user" className="button placeholder_text">Create New Account</button>
          <p id="login_error_hint" className="text"></p>
        </div>
      </div>

    </div>
  );
}

export default App;
