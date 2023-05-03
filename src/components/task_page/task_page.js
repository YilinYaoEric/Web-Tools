import { useEffect, useState } from "react";
import {Time_passed} from "../time.js"; 
import NewTaskArea from "./new_task_area.js";
import TasksArea from "./tasks_area.js";
import DescriptionArea from "./description_area.js";
import TimeArea from "./time_area.js";
// TODO swtich page
// TODO server

/**
 * The task page contains task area, timer, new task area, and description area
 * @param {string} tasks_list_string representing a list of tasks in JSON.stringify form
 * @param {Object} default_task representing an empty task
 * @returns a div representing the whole page
 */
const TaskPage = ({tasks_list_string, default_task}) => {

  // tasks_list[0] = {id: current focus id, name: localStorage name, page: current page number}
  const [tasks_list, set_tasks_list] = useState(
      adjust_tasks(parse_data(tasks_list_string))
    );
  
  const name = tasks_list[0].name

  // save to localStorage
  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(tasks_list));
  }, [tasks_list, name]);

  // temperary foucs is the foucs that user's mouse is moved on to, but haved
  // clicked yet.
  const [temperary_foucs, set_temp_focus] = useState(0);

  // auto update the time of the foucsed task's time_passed
  const [start_time, set_start_time] = useState(new Date());
  useEffect( () => {
    const interval_id = setInterval( () => {
      // if there is no focus, return and delete the start time for now
      if (!tasks_list[0].id) {
        set_start_time(null);
        return;
      }

      let start = start_time ? start_time : new Date();
      // current time += (time now - time start)
      let time_now = new Date();
      let time_in_loop = tasks_list[tasks_list[0].id].time_passed;

      // diff in date
      time_in_loop.add( (time_now.getDate() - start.getDate()) * 24 * 60 * 60); 
      // diff in hours
      time_in_loop.add( (time_now.getHours() - start.getHours()) * 60 * 60);
      // diff in minutes
      time_in_loop.add( (time_now.getMinutes() - start.getMinutes()) * 60);
      // diff in seconds 
      time_in_loop.add( (time_now.getSeconds() - start.getSeconds()));
      
      set_time_passed(tasks_list[0].id, time_in_loop);
      
      // store the current time as time start
      set_start_time(new Date());
    }, 100)
    return () => clearInterval(interval_id);
  });


  /**
   * perform the click action to the given id
   * if a clicked, then focus on the clicked task
   * if the task is already focused, unfocus it.
   * @param {number} id the id of the task 
   */
  function clicked_task(id) {
    let this_task = tasks_list[id];
    let focused_id = tasks_list[0].id;

    if (this_task.active === 0) {
      return;
    }

    let temp_list = [];
    for (let i = 0; i < tasks_list.length; i++) {
      temp_list[i] = tasks_list[i];
    }

    if (id === focused_id) {
      this_task.is_light = 0;
      // TODO write local storage and sql storage
      temp_list[0].id = 0;
      set_tasks_list(adjust_tasks(temp_list));
      return;
    }

    // if there is another focused, cancle the focus
    if (focused_id) {
      // mouseout here if there is a bug occured
      clicked_task(focused_id);
    }

    temp_list[0].id = id;
    this_task.is_light = 1;
    set_tasks_list(adjust_tasks(temp_list));
  }


  /**
   * change the light value of the task list of the given task(id)
   * @param {number} id the id of the target task
   * @param {number} light_value the new value of light, can only be 1 or 0
   */
  function set_light(id, light_value) {
    set_value_of_tasks_list(id, "is_light", light_value);
  }


  /**
   * change the description value of the task list of the given task(id)
   * @param {number} id the id of the target task
   * @param {string} description_value the new value of description
   */
  function set_description(id, description_value) {
    set_value_of_tasks_list(id, "description", description_value);
  }


  /**
   * change the time_value of the task list of the given task(id)
   * @param {number} id  the id of the target task
   * @param {Time_passed} time_value an object representing the time passed
   */
  function set_time_passed(id, time_value) {
    set_value_of_tasks_list(id, "time_passed", time_value);
  }


  /**
   * flip the page by x, where x = add_num.
   * @param {number} add_num add page by add_num. Can be negative
   */
  function add_page_num(add_num) {
    let page = tasks_list[0].page;
    page += add_num;
    if (page > (tasks_list.length-1)/4 - 1) {
      page -= (tasks_list.length-1)/4;
    }
    if (page < 0) {
      page = (tasks_list.length-1)/4 - 1;
    }
    set_value_of_tasks_list(0, "page", page);
  }


  /**
   * change the target value of the task list of the given task(id)
   * @param {number} id  the id of the target task
   * @param {string} value_name the value name for accessing the value in task list
   * @param {*} value the target value
   */
  function set_value_of_tasks_list(id, value_name, value) {
    let temp_list = [];
    for (let i = 0; i < tasks_list.length; i++) {
      temp_list[i] = tasks_list[i];
    }
    temp_list[id][value_name] = value;
    set_tasks_list(temp_list);
  }


  /**
   * @param {list} list 
   * @returns {list} a new list with an new empty task at end
   */
  function append_empty_task(list) {
    return [...list, default_task];
  }


  /**
   * user should call this method everytime any changes is made to the list
   * @param {list} list incomplete list of task
   * @returns a list that is ready to use
   */
  function adjust_tasks(list) {
    let temp_list = (list.filter( (t) => {return t.active===undefined || t.active} ));

    let repeat = (4 - (temp_list.length - 1) % 4);
    repeat = repeat === 4 && temp_list.length > 1 ? 0 : repeat; 
    for (let i = 0; i < repeat; i++) {
      temp_list = append_empty_task(temp_list);
    }
    let page = temp_list[0].page;
    if (page > (temp_list.length-1)/4 - 1) {
      page -= (temp_list.length-1)/4;
    }
    if (page < 0) {
      page = (temp_list.length-1)/4 - 1;
    }
    temp_list[0].page = page;

    return temp_list;
  }


  /**
   * This will append a new task with the given properties and update the
   * current tasks list data
   * @param {string} name the task name that will be displayed to user
   * @param {*} description the description that will be displayed to user
   * @param {*} predicted_time the predicted time that will be displayed to user
   */
  function append_task(name, description, predicted_time) {
    let list = [...tasks_list, {
      is_light: 0,
      text_content: name,
      active: 1,
      time_passed: new Time_passed(0,0,0),
      predicted_time: predicted_time,
      description: description
    }]; 
    set_tasks_list(adjust_tasks(list));
  }


  /**
   * delete the current focusing task
   */
  function finish_current_focus() {
    if (!tasks_list[0].id) {
      console.log("Error: Finishing task with no focus");
      return;
    }
    let temp_list = (tasks_list.filter( (t) => {return t!==tasks_list[tasks_list[0].id]} ));
    temp_list[0].id = 0;
    set_temp_focus(0);
    set_tasks_list(adjust_tasks(temp_list));
  }

  return (
    <div id="main_interface">

        <TasksArea tasks_list={tasks_list} clicked_task={clicked_task} set_light={set_light} 
        set_temp_focus={set_temp_focus} add_page_num={add_page_num}/>          

        <DescriptionArea tasks_list={tasks_list} set_description={set_description} temp_foucs={temperary_foucs}
        finish_current_focus={finish_current_focus}/>
          
        <TimeArea tasks_list={tasks_list} temp_foucs={temperary_foucs}/>

        <NewTaskArea new_task={append_task}/>
    </div>
  );
}

/**
 * parse a string data to JSON data, while some objects inside
 * are transfered in to Time_passed Objects defined in time.js
 * @param {string} data a string in json fomate
 * @returns {Object} the parsed result
 */
function parse_data(data) {
  let ret = JSON.parse(data);
  Object.keys(ret).forEach( (id) => {
    let temp_obj = ret[id]
    Object.keys(temp_obj).forEach( (key) => {
      let hours = temp_obj[key].hours;
      let minutes = temp_obj[key].minutes;
      let seconds = temp_obj[key].seconds;
      if (hours!==undefined && minutes!==undefined && seconds!==undefined) {
        ret[id][key] = new Time_passed(hours, minutes, seconds);
      }
    } )
  })
  
  return ret;
}

export default TaskPage;