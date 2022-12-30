/*
    2022/12/24
    @Yilin Yao
    linked to web.html
*/

"use strict";

(function() {
    const ALL_TASKS_NAMES = ["task1", "task2", "task3", "task4"]; 
    const TOTAL_TASKS_BLOCK = ALL_TASKS_NAMES.length;

    const FIRST_TASK_ATTRIBUTES= [
        "Welcome to Raccoon Work", "00:03:00", 
        "This is a website built for task management and time management. \nYou can create a task on the right to begin. \n" +
        "You will have to predict the time spend on the task before doing it. ", 
        '00:00:00'
    ];

    // html addresses 
    const TASK_LIGHT_CLASS = ".task_light";
    const TASK_NAME_CLASS = ".task_name";
    const BIG_TIME_CLASS = "#first_time";
    const ALTERNATIVE_BIG_TIME = "#second_time";
    const PREDICTED_TIME_CLASS = ".predict_time";
    const PREDICTED_TIME_PREFIX = "Predicted: ";
    const CIRCLE_IN_INFO_BOX_CLASS = '.info_box .circle';
    const VECTOR_IN_INFO_BOX_CLASS = '.info_box .vector'; // TODO, make a black and white version
    const TASK_CONFIRM_CIRCLE_CLASS = '.info_box .confirm_buttom';
    const DESCRIPTION_BLOCK_TEXT_CLASS = '.info';
    const EXTENTION_BLOCK_CONFIRM_CLASS = '.extention_block .confirm_buttom';
    const EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS = '.extention_block .circle';
    const PAGE_LEFT_ARROW_CLASS = '.tasks_left_arrow';
    const PAGE_RIGHT_ARROW_CLASS = '.tasks_right_arrow';
    const TASK_CLASS = ".task";

    // all attributes positions
    const EXTENSION_BLOCK_NAME_CLASS = '#task_name';
    const EXTENSION_BLOCK_TIME_CLASS = '#task_time';
    const EXTENSION_BLOCK_DESCRIPTION_CLASS = '#description';
    const NEW_TASK_ALL_ATTRIBUTES = [
        EXTENSION_BLOCK_NAME_CLASS, EXTENSION_BLOCK_TIME_CLASS, EXTENSION_BLOCK_DESCRIPTION_CLASS
    ];
    
    const TASK_POSITION_CHAR_LOCATION_IN_TASK_NAME = 4;
    const GAP_BETWEEN_POSITION_AND_ACTUAL_ARRAY_POSITION = 1;

    // Undefined data's defalt status
    const UNDEFINED_TASK_ID = -1; // need to be a small number
    const UNDEFINED_FOCUS = -1;
    const UNDEFINED_TIME_INTERVAL = -1;
    const UNDEFINED_INFO = "";
    const DEFALT_TIME = "00:00:00";
    const UNDEFINED_TASK_NAME = "Unname Task";
    const AUTO_PENDING_OF_UNDEFINED_TASK_NAME = 1; 

    // opacity changes of the the buttoms. 
    const NON_DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 0.2;
    const NON_DARK_LIGHT_OPACITY_FOR_TASK_NAME = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_NAME = 0.6;
    const NON_DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 1;
    const DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 0.5;

    

    // this indicates the properties will be involved in each tasks. 
    // more properties can be added here. 
    // all time are in format: 00:00:00
    let current_tasks = []; // assume sorted. (id)
    let storage_temptasks_stack = [];
    let completed_tasks = []; // sorted based on the time come in. (id)
    let current_focus = UNDEFINED_FOCUS; // position(1-4)
    let temp_focus_info = UNDEFINED_INFO; 
    let temp_focus_pre_time = UNDEFINED_INFO;
    let time_interval_id = UNDEFINED_TIME_INTERVAL; 
    let id_count = UNDEFINED_TASK_ID + 1;
    let all_tasks_id_by_position = [UNDEFINED_TASK_ID, UNDEFINED_TASK_ID, UNDEFINED_TASK_ID,UNDEFINED_TASK_ID];
    // attributes below are maps. The key is the task id. 
    let tasks_names = new Map();
    let tasks_descriptions = new Map();
    let tasks_time = new Map();
    let time_passed = new Map();
    // IMPORTANT
    const ALL_ATTRIBUTES= [
        tasks_names, tasks_time, tasks_descriptions, time_passed
    ];
    const NEW_TASK_ALL_ATTRIBUTES_UNDERFINED_STATUES = [
        UNDEFINED_TASK_NAME, DEFALT_TIME, UNDEFINED_INFO, DEFALT_TIME
    ];


    window.addEventListener('load', init);
    
    /**
     * init funciton initialize the page
     */
    function init(){
        init_task();
        init_complete_task_buttom();
        init_extention();
    }
    
    // This initialize tasks block. 
    function init_task(){

        // add contents to task1
        let task1_info = FIRST_TASK_ATTRIBUTES;
        create_new_task(task1_info);
        place_all_tasks();
        lock_description();     
    
        // create click, mouseover, mouseout effect to the Task blocks. 
        function initializeClickEvents(ele) {
            ele.addEventListener('click', clickAction);
            ele.addEventListener('mouseover', mouseoverAction);
            ele.addEventListener('mouseout', mouseoffAction);
            /*
            a feature can be added later
            ele.addEventListener('dblclick', (event) => {
                complete_task(current_focus);
            })
            */
        }
        
        // find each element by their class and call initilizerClickEnvents
        ALL_TASKS_NAMES.forEach(
            name => initializeClickEvents(document.querySelector("." + name))
        );
    }

    // input the click event
    // return an array: [position, id]
    function find_information_of_clicked_element(ele) {
        ele = ele.target;

        if (ele.className == TASK_LIGHT_CLASS.substring(1) || ele.className == TASK_NAME_CLASS.substring(1)) {
            ele = ele.parentElement;
        }
        let position = ele.className.charAt(TASK_POSITION_CHAR_LOCATION_IN_TASK_NAME);
        let id = all_tasks_id_by_position[position - GAP_BETWEEN_POSITION_AND_ACTUAL_ARRAY_POSITION];
        return [position, id];
    }

    // this will light the bar and show description
    function mouseoverAction(ele) {
        let info = find_information_of_clicked_element(ele);
        if (info == 'page') {
            return;
        }
        mouseover_action_ele(info[0], info[1]);
    }

    // mouseoverAction helper method. 
    function mouseover_action_ele(position, id) {
        if (position == current_focus) {
            return;
        }
        light_on(position);
        if (id == UNDEFINED_TASK_ID) {
            return;
        }
        temp_focus_info = show_description(id);
        temp_focus_pre_time = show_predicted_time(id);
        display_second_time(id);
    }

    // this will turn off the light on the bar. Do not turn off if the bar is on focus. 
    // return the description to the focus. 
    function mouseoffAction(ele){
        let info = find_information_of_clicked_element(ele);
        if (info == 'page') {
            return;
        }
        mouseoff_actiopn_ele(info[0], info[1])
    }
    
    // mouseoffAction helper method
    function mouseoff_actiopn_ele(position, id) {
        if (position != current_focus || id == UNDEFINED_TASK_ID){
            light_off(position);
            if (id != UNDEFINED_TASK_ID) {
                tasks_descriptions.set(id, change_description_to(temp_focus_info));
                temp_focus_info = UNDEFINED_INFO;
                change_predicted_time_to(temp_focus_pre_time);
                temp_focus_pre_time = UNDEFINED_INFO;
                display_first_time();
            }
            
        }
    }

    // this will show description, light up, change the predicted time, start counting the time
    // change focus to the current block. 
    // if the focus is already at the current block, pause the time. 
    // if time is paused, cancle the focus, refresh what is in the description, lock the description
    function clickAction(ele){
        // locate the actual target element
        let info = find_information_of_clicked_element(ele);
        if (info == 'page') {
            return;
        }
        click_action_ele(info[0], info[1]);
    }

    // clickAction helper method
    function click_action_ele(position, id){
        // if there is no tasks in the given position, do nothing
        if (id == UNDEFINED_TASK_ID) {return;}
            
        // if we are already focusing on this position, cancle the focus. 
        if (current_focus == position) {
            // TODO 给每个特性搞一个默认的Object，不要每个都特例写，方便之后更改
            // turn off the light bar
            light_off(position);
            // save the current showing description and reset description to ''
            tasks_descriptions.set(id, change_description_to(''));
            hide_confirm_circle();
            change_predicted_time_to(DEFALT_TIME);
            // save the current time and reset time back to defult time
            time_passed.set(id, set_time(DEFALT_TIME));
            // reset focus to nothing
            current_focus = UNDEFINED_FOCUS;
            // stop time clicking
            clearInterval(time_interval_id);
            // reset the public variable for time clicking
            time_interval_id = UNDEFINED_TIME_INTERVAL;
            // mouseover
            mouseover_action_ele(position, id);
            // lock the user access of the description block. 
            lock_description();
            return;
        }

        // if there is another focus
        if (current_focus != -1) {
            let temp_pos = current_focus;
            let temp_id = all_tasks_id_by_position[temp_pos-GAP_BETWEEN_POSITION_AND_ACTUAL_ARRAY_POSITION];
            // if more bugs occured with the switching the tasks, uncomment the two lines below on mousever_action_ele
            mouseoff_actiopn_ele(position, id);
            // mouseover_action_ele(temp_pos, temp_id);
            click_action_ele(temp_pos, temp_id);
            mouseoff_actiopn_ele(temp_pos, temp_id);
            // mouseover_action_ele(position, id);
        }

        // grab the focus. 
        current_focus = position;

        light_on(position);
        show_description(id);
        show_confirm_circle();
        show_predicted_time(id);
        set_up_time(id);
        display_first_time();
        unlock_decription();
        time_interval_id = setInterval(start_time, 1000);
    }

    // init the complete task buttom at the info/description block. 
    function init_complete_task_buttom() {
        init_event_listener();
        // light off for the confirm buttom.
        document.querySelector(CIRCLE_IN_INFO_BOX_CLASS).style.opacity = DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE;

        function circle_mouseout() {
            // light off
            document.querySelector(CIRCLE_IN_INFO_BOX_CLASS).style.opacity = DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE;
        }

        function circle_mouseover() {
            // light on
            document.querySelector(CIRCLE_IN_INFO_BOX_CLASS).style.opacity = NON_DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE;
        }

        function complete_task_current(){
            complete_task(current_focus);
        }

        function init_event_listener() {
            document.querySelector(TASK_CONFIRM_CIRCLE_CLASS).addEventListener('click', complete_task_current);
            document.querySelector(TASK_CONFIRM_CIRCLE_CLASS).addEventListener('mouseout', circle_mouseout);
            document.querySelector(TASK_CONFIRM_CIRCLE_CLASS).addEventListener('mouseover', circle_mouseover);
        } 
    }
    
    // init the extention block
    function init_extention() {
        // the function perform after the use click on the confirm buttom on the extension block
        function confirm_click() {
            if (document.querySelector(NEW_TASK_ALL_ATTRIBUTES[1]).value != '') {
                create_new_task_using_new_task_info();
                // delete the value in each answer box. 
                for (let i = 0; i < NEW_TASK_ALL_ATTRIBUTES.length; i++) {
                    document.querySelector(NEW_TASK_ALL_ATTRIBUTES[i]).value = '';
                }
            }
        }

        // the function perform after the use mouse move over on the confirm buttom on the extension block
        function confirm_mouseover() {
            if (document.querySelector(NEW_TASK_ALL_ATTRIBUTES[1]).value != ''){
                document.querySelector(EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS).style.opacity = NON_DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE;
            }
        }

        // the function perform after the use mouse move out on the confirm buttom on the extension block
        function confirm_mouseout() {
            document.querySelector(EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS).style.opacity = DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE;
        }

        function init_new_task() {
            document.querySelector(EXTENTION_BLOCK_CONFIRM_CLASS).addEventListener('mouseover', confirm_mouseover);
            document.querySelector(EXTENTION_BLOCK_CONFIRM_CLASS).addEventListener('mouseout', confirm_mouseout);
            document.querySelector(EXTENTION_BLOCK_CONFIRM_CLASS).addEventListener('click', confirm_click);

            document.querySelector(PAGE_LEFT_ARROW_CLASS).addEventListener('click', page_left);
            document.querySelector(PAGE_RIGHT_ARROW_CLASS).addEventListener('click', page_right);
        }

        init_new_task();
        confirm_mouseout();
    }

    /*
        Below are helper functions
    */

    // append changes on the current_focus by setting the first few tasks to the end
    // return -1 if no changes have been append. 
    function page_left(input) {
        for (let i = 0; i < TOTAL_TASKS_BLOCK; i++) {
            if (storage_temptasks_stack.length == 0) {
                while (input != 'called' && page_right('called') != -1)
                place_all_tasks();
                return -1;
            }
            current_tasks.unshift(storage_temptasks_stack.pop());
        }
        place_all_tasks();
        return 1;
    }
    
    // append changes on the current_focus by setting the last few tasks to the front
    // return -1 if no changes have been append
    function page_right(input) {
        if (current_tasks.length <= TOTAL_TASKS_BLOCK) {
            // if we can' flip no more, flip back as much as we can
            while (input != 'called' && page_left('called') != -1) {} 
            place_all_tasks();
            return -1;
        }
        for (let i = 0; i < TOTAL_TASKS_BLOCK; i++) {
            storage_temptasks_stack.push(current_tasks.shift());
        }
        place_all_tasks();
        return 1;
    }

    // return the target light element by given the task number. 
    function find_light(num){
        let ele = document.querySelector('.task' + num + ' .task_light');
        return ele;
    }

    // return the target name element by given the task number. 
    function find_name(num) {
        let ele = document.querySelector('.task' + num + ' .task_name');
        return ele;
    }

    // light the target task light
    // num: 1-4
    function light_on(num) {
        // find the light element
        find_light(num).style.opacity = NON_DARK_LIGHT_OPACITY_FOR_TASK_LIGHT;
        find_name(num).style.opacity = NON_DARK_LIGHT_OPACITY_FOR_TASK_NAME;
    }

    // light the target task light
    // num: 1-4
    function light_off(num) {
        // find the light element
        find_light(num).style.opacity = DARK_LIGHT_OPACITY_FOR_TASK_LIGHT;
        find_name(num).style.opacity = DARK_LIGHT_OPACITY_FOR_TASK_NAME;
    }

    // show description of given task
    // if the id is -1, change the description to null
    // return the previous content. 
    function show_description(id) {
        let str = "";
        if (id != UNDEFINED_TASK_ID) {
            str = tasks_descriptions.get(id);
        }
        return change_description_to(str);
    }

    // change the description info to the given string. 
    // assume undefine str is ""
    // return the previous value
    function change_description_to(str) {
        if (str == undefined) {
            str = '';
        }
        let ele = document.querySelector('.info_box .info');
        let ret = ele.value; 
        ele.value = str;
        return ret;
    }

    // show the predicted time of given id
    // return the previous predicted time. 
    function show_predicted_time(id) {
        return change_predicted_time_to(tasks_time.get(id));
    }

    // change the prediction time to given string. 
    // return the previous predicted time. 
    function change_predicted_time_to(str) {
        let ele = document.querySelector(PREDICTED_TIME_CLASS);
        let ret = ele.textContent.substring(PREDICTED_TIME_PREFIX.length);
        ele.textContent = PREDICTED_TIME_PREFIX + str;
        return ret;
    }

    // display the second time using given id's time information and display the hide the second time. 
    function display_second_time(id) {
        let str = time_passed.get(id);
        let arr = str.split(':');
        for (let i = 0; i < 3; i++) {
            if (arr[i].toString().length == 1) {
                arr[i] = '0' + arr[i];
            }
        }
        str = arr[0] + ':' + arr[1] + ':' + arr[2];
        let ele = document.querySelector(ALTERNATIVE_BIG_TIME);
        ele.textContent = str;
        // hide first time
        document.querySelector(BIG_TIME_CLASS).style.visibility = 'hidden';
        // show second time
        document.querySelector(ALTERNATIVE_BIG_TIME).style.visibility = 'visible';
    }

    // hide the second time and display the first time
    function display_first_time() {
        document.querySelector(BIG_TIME_CLASS).style.visibility = 'visible';
        document.querySelector(ALTERNATIVE_BIG_TIME).style.visibility = 'hidden';
    }

    // set the time to the time passed saved earlier.  
    function set_up_time(id) {
        set_time(time_passed.get(id));
    }

    // set the time to the given str and return the previous time.
    // need to be in form 00:00:00
    // don't need all numbers in 2 digits, but need two ':'.  
    // return the previous time data. 
    function set_time(str) {
        let arr = str.split(':');
        for (let i = 0; i < 3; i++) {
            if(arr[i].toString().length == 1) {
                arr[i] = '0' + arr[i];
            }
        }
        str = arr[0] + ':' + arr[1] + ':' + arr[2];
        // find time element
        let ele = document.querySelector(BIG_TIME_CLASS);
        let ret = ele.textContent;
        ele.textContent = str;
        return ret;
    }

    // start counting the time
    async function start_time() {
            let arr = set_time(DEFALT_TIME).split(':');
            arr[2]++;
            for(let i = 2; i > 0; i--) {
                if (arr[i] >= 60) {
                    arr[i] -= 60;
                    arr[i-1]++;
                }
            }
            if (arr[0] >= 60) {return;}
            set_time(arr[0] + ":" + arr[1] + ":" + arr[2]);
    }

    // light up the description block's confirm circle. 
    function show_confirm_circle() {
        document.querySelector(CIRCLE_IN_INFO_BOX_CLASS).style.visibility = 'visible';
        document.querySelector(VECTOR_IN_INFO_BOX_CLASS).style.visibility = 'visible';
    }

    function hide_confirm_circle() {
        document.querySelector(CIRCLE_IN_INFO_BOX_CLASS).style.visibility = 'hidden';
        document.querySelector(VECTOR_IN_INFO_BOX_CLASS).style.visibility = 'hidden';
    }

    function lock_description(){
        document.querySelector(DESCRIPTION_BLOCK_TEXT_CLASS).readOnly = true;
    }

    function unlock_decription() {
        document.querySelector(DESCRIPTION_BLOCK_TEXT_CLASS).readOnly = false;
    }

    // create a new task using the extention block's informaiton
    function create_new_task_using_new_task_info() {
        let information = [];
        for(let i = 0; i < ALL_ATTRIBUTES.length; i++) {
            if (i >= NEW_TASK_ALL_ATTRIBUTES.length) {
                information.push(NEW_TASK_ALL_ATTRIBUTES_UNDERFINED_STATUES[i]);
                continue;
            }
            let str = document.querySelector(NEW_TASK_ALL_ATTRIBUTES[i]).value;
            if (str == '') {
                str = NEW_TASK_ALL_ATTRIBUTES_UNDERFINED_STATUES[i];
            }
            information.push(str);
        }
        create_new_task(information);
    }

    // give the element and the information of the task in an array. 
    // the given information has be in order of all_attributes
    // create a new task. 
    // add id of the task to current tasks.
    // return the id 
    // This will ensure all name of the tasks are unique by adding a number to the end of the task. 
    function create_new_task(information) {
        // incase id_count changes during this method, we take one num first and work on that
        let id = id_count++;
        // if task name is not unique, add a number after it to make it unique
        // TODO: fix
        function check_unique(name) {
            console.log(current_tasks.length);
            for (let i = 0; i < current_tasks.length; i++){
                console.log(i);
                console.log(tasks_names.get(current_tasks[i]));
                // if the name exists
                if (name == tasks_names.get(current_tasks[i]) ){
                    console.log('1');
                    // if the last digit is an integer, and the -2(position) digit is ' ', the last integer++, otherwise append ' 1'
                    if (Number.isInteger(name.charAt(name.length)) && name.charAt(name.length-1) == ' ') {
                        let ret = name.substring(0, name.length);
                        ret += name.charAt(name.length) + 1;
                        return check_unique(ret);
                    } else {
                        return check_unique(name + ' ' + AUTO_PENDING_OF_UNDEFINED_TASK_NAME);
                    }
                }
                return name;
            }
        }
        check_unique(information[0]);

        for (let i = 0; i < information.length; i++) {
            ALL_ATTRIBUTES[i].set(id, information[i]);
        }
        current_tasks.push(id);
        place_all_tasks();
        return id;
    }

    // this action will place a task to the pointing position, 1-4. 
    // This doesn't inlcuding deleting the task. 
    function place_task(position, id) {
        if (id == undefined) {
            id = UNDEFINED_TASK_ID;
        }
        let target_position_str = TASK_CLASS + position + ' ' + TASK_NAME_CLASS;
        document.querySelector(target_position_str).textContent = tasks_names.get(id);
        all_tasks_id_by_position[position-1] = id;
    }

    // automaticlly place all aviliable tasks to the 4 blocks based on the current_tasks array
    function place_all_tasks() {
        for (let i = 0; i < TOTAL_TASKS_BLOCK; i++) {
            place_task(i + 1, current_tasks[i]);
        }
    }

    // complete the task 
    function complete_task(position) {
        let id = all_tasks_id_by_position[position-GAP_BETWEEN_POSITION_AND_ACTUAL_ARRAY_POSITION];
        // to remove the click condition: 
        // click on the ele
        click_action_ele(position, id);
        // mouseout
        mouseoff_actiopn_ele(position, id);

        // delete the task from backend
        delete_task(id);

        // assign the new tasks to the task block. 
        place_all_tasks();
    }
    
    // delete task from the current list and put it into completed list. 
    function delete_task(id) {
        // delete the id from current_tasks
        let new_arr = [];
        for (let i = 0; i < current_tasks.length; i++){
            let temp_id = current_tasks[i];
            if (temp_id != id) {
                new_arr.push(temp_id);
            } else {
                // put it here incase there is an invalid id. 
                completed_tasks.push(id);
            }
        }
        current_tasks = new_arr;
    }

})();