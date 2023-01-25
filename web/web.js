/*
    2022/12/24
    @Yilin Yao
    linked to web.html
*/

"use strict";

(function() {
    // some constant to avoid magic number
    const ONE_SECOND = 1000;
    const LENGTH_OF_TIME_FOMAT = 2; // 2 stands for 00:00:00, 1 stands for 00:00, 0 stands for 00
    const TIME_SEPERATOR = ':';

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
    const VECTOR_IN_INFO_BOX_CLASS = '.info_box .vector'; 
    const TASK_CONFIRM_CIRCLE_CLASS = '.info_box .confirm_buttom';
    const DESCRIPTION_BLOCK_TEXT_CLASS = '.info';
    const EXTENTION_BLOCK_CONFIRM_CLASS = '.extention_block .confirm_buttom';
    const EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS = '.extention_block .circle';
    const PAGE_LEFT_ARROW_CLASS = '.tasks_left_arrow';
    const PAGE_RIGHT_ARROW_CLASS = '.tasks_right_arrow';
    const TASK_CLASS = ".task";
    const MAIN_PAGE_BUTTOM_ID = '#bar_point1';
    const MAIN_PAGE_ID = '#main_interface';
    const EXTENSION_PAGE_BUTTOM_ID = '#bar_point2';
    const EXTENSION_PAGE_ID = '#extension_page';
    const LOGIN_PAGE_ID = "#login_page";
    const LOG_IN_LOGO_ID = "#login_logo";
    const USERNAME_ID = "#username";
    const PASSWORD_ID = "#password";

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
    const DEFALT_TIME = get_defalt_time();
    const UNDEFINED_TASK_NAME = "Unname Task";
    const AUTO_PENDING_OF_UNDEFINED_TASK_NAME = 1; 

    // opacity changes of the the buttoms. 
    const NON_DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 0.2;
    const NON_DARK_LIGHT_OPACITY_FOR_TASK_NAME = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_NAME = 0.6;
    const NON_DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 1;
    const DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 0.5;

    // fetch information 
    const BASE_URL = 'http://localhost:8000/user';
    const CREATE_URL = '/create';
    const EXIST_URL = '/exist';
    const LOGIN_ATTAMPT_URL = '/login_attampt';
    const UPDATE_STATUS_URL = '/update_status';
    const GET_STATUS = 'get_status';
    

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
    let current_page_element;

    // server fetch global data
    let loged_in = false;
    let global_username = ""; // TODO set this
    let global_password = "";
    let server_status = {
        error_message: "",
        has_error: false
    };

    // IMPORTANT
    const ALL_ATTRIBUTES= [
        tasks_names, tasks_time, tasks_descriptions, time_passed
    ];
    const ALL_ATTRIBUTES_NAMES = [
        "tasks_names", "tasks_time", "tasks_descriptions", "time_passed"
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
        init_page_buttoms();
        init_all_extensions();
        init_styles();
        init_login();
    }
    
    // This initialize tasks block. 
    function init_task(){

        // add contents to task1
        // localStorage.clear();
        if (localStorage.getItem('current_tasks') == null) {
            create_new_task(FIRST_TASK_ATTRIBUTES);
        } else {
            read_data_from_local_host();
        }
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
        mouseoff_actiopn_ele(info[0], info[1])
    }
    
    // mouseoffAction helper method
    function mouseoff_actiopn_ele(position, id) {
        if (position != current_focus || id == UNDEFINED_TASK_ID){
            light_off(position);
            if (id == UNDEFINED_TASK_ID) {
                return;
            }
            tasks_descriptions.set(id, change_description_to(temp_focus_info));
            temp_focus_info = UNDEFINED_INFO;
            change_predicted_time_to(temp_focus_pre_time);
            temp_focus_pre_time = UNDEFINED_INFO;
            display_first_time();
        }
    }

    // this will show description, light up, change the predicted time, start counting the time
    // change focus to the current block. 
    // if the focus is already at the current block, pause the time. 
    // if time is paused, cancle the focus, refresh what is in the description, lock the description
    function clickAction(ele){
        // locate the actual target element
        let info = find_information_of_clicked_element(ele);
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
        start_time_clicking();
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

            if (document.querySelector(NEW_TASK_ALL_ATTRIBUTES[1]).value != 'Invalid time string') {
                create_new_task_using_new_task_info();
                // delete the value in each answer box. 
                for (let i = 0; i < NEW_TASK_ALL_ATTRIBUTES.length; i++) {
                    document.querySelector(NEW_TASK_ALL_ATTRIBUTES[i]).value = '';
                }
            }
        }

        // the function perform after the use mouse move over on the confirm buttom on the extension block
        function confirm_mouseover() {
            if (document.querySelector(NEW_TASK_ALL_ATTRIBUTES[1]).value != 'Invalid time string'){
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
        document.querySelector(EXTENSION_BLOCK_TIME_CLASS).addEventListener('blur', init_blur_out_time);
    }

    // init the left bar and the buttoms on it
    function init_page_buttoms() {
        current_page_element = document.querySelector(MAIN_PAGE_ID);
        function show_main() {
            switch_page(document.querySelector(MAIN_PAGE_ID));
        }

        function show_extension() {
            switch_page(document.querySelector(EXTENSION_PAGE_ID));
        }

        document.querySelector(MAIN_PAGE_BUTTOM_ID).addEventListener('click', show_main);
        document.querySelector(EXTENSION_PAGE_BUTTOM_ID).addEventListener('click', show_extension);
    }

    function init_blur_out_time(ele) {
        magicTime(ele.target);
    }

    /*
        import magicTime()
        Copyright: 
            Magic time parsing, based on Simon Willison's Magic date parser
            @see http://simon.incutio.com/archive/2003/10/06/betterDateInput
            @author Stoyan Stefanov &lt;stoyan@phpied.com&gt;
    */ 
    
    /**
     * This is the place to customize the result format,
     * once the date is figured out
     *
     * @param Date d A date object
     * @return string A time string in the preferred format
     */
    function getReadable(d) {
        return padAZero(d.getHours())
            + ':'
            + padAZero(d.getMinutes())
            + ':'
            + padAZero(d.getSeconds());
    }
    /**
     * Helper function to pad a leading zero to an integer
     * if the integer consists of one number only.
     * This function s not related to the algo, it's for
     * getReadable()'s purposes only.
     *
     * @param int s An integer value
     * @return string The input padded with a zero if it's one number int
     * @see getReadable()
     */
    function padAZero(s) {
        s = s.toString();
        if (s.length == 1) {
            return '0' + s;
        } else {
            return s;
        }
    }

    /**
     * Array of objects, each has:
     * <ul><li>'re' - a regular expression</li>
     * <li>'handler' - a function for creating a date from something
     *     that matches the regular expression</li>
     * <li>'example' - an array of examples that show matching examples</li>
     * Handlers may throw errors if string is unparseable.
     * Examples are used for automated testing, so they should be updated
     *   once a regexp is added/modified.
     */
    var timeParsePatterns = [
        // Now
        {   re: /^now/i,
            example: new Array('now'),
            handler: function() {
                return new Date();
            }
        },
        // p.m.
        {   re: /(\d{1,2}):(\d{1,2}):(\d{1,2})(?:p| p)/,
            example: new Array('9:55:00 pm','12:55:00 p.m.','9:55:00 p','11:5:10pm','9:5:1p'),
            handler: function(bits) {
                var d = new Date();
                var h = parseInt(bits[1], 10);
                if (h < 12) {h += 12;}
                d.setHours(h);
                d.setMinutes(parseInt(bits[2], 10));
                d.setSeconds(parseInt(bits[3], 10));
                return d;
            }
        },
        // p.m., no seconds
        {   re: /(\d{1,2}):(\d{1,2})(?:p| p)/,
            example: new Array('9:55 pm','12:55 p.m.','9:55 p','11:5pm','9:5p'),
            handler: function(bits) {
                var d = new Date();
                var h = parseInt(bits[1], 10);
                if (h < 12) {h += 12;}
                d.setHours(h);
                d.setMinutes(parseInt(bits[2], 10));
                d.setSeconds(0);
                return d;
            }
        },
        // p.m., hour only
        {   re: /(\d{1,2})(?:p| p)/,
            example: new Array('9 pm','12 p.m.','9 p','11pm','9p'),
            handler: function(bits) {
                var d = new Date();
                var h = parseInt(bits[1], 10);
                if (h < 12) {h += 12;}
                d.setHours(h);
                d.setMinutes(0);
                d.setSeconds(0);
                return d;
            }
        },
        // hh:mm:ss
        {   re: /(\d{1,2}):(\d{1,2}):(\d{1,2})/,
            example: new Array('9:55:00','19:55:00','19:5:10','9:5:1','9:55:00 a.m.','11:55:00a'),
            handler: function(bits) {
                var d = new Date();
                d.setHours(parseInt(bits[1], 10));
                d.setMinutes(parseInt(bits[2], 10));
                d.setSeconds(parseInt(bits[3], 10));
                return d;
            }
        },
        // hh:mm
        {   re: /(\d{1,2}):(\d{1,2})/,
            example: new Array('9:55','19:55','19:5','9:55 a.m.','11:55a'),
            handler: function(bits) {
                var d = new Date();
                d.setHours(parseInt(bits[1], 10));
                d.setMinutes(parseInt(bits[2], 10));
                d.setSeconds(0);
                return d;
            }
        },
        // hhmmss
        {   re: /(\d{1,6})/,
            example: new Array('9','9a','9am','19','1950','195510','0955'),
            handler: function(bits) {
                var d = new Date();
                var h = bits[1].substring(0,2);
                var m = parseInt(bits[1].substring(2,4), 10);
                var s = parseInt(bits[1].substring(4,6), 10);
                if (isNaN(m)) {m = 0;}
                if (isNaN(s)) {s = 0;}
                d.setHours(parseInt(h, 10));
                d.setMinutes(parseInt(m, 10));
                d.setSeconds(parseInt(s, 10));
                return d;
            }
        },


    ];

    /**
     * Method that loops through all regexp's examples and lists them.
     * Optionally, the method can also run tests with the examples.
     *
     * @param boolean run_test TRUE is tests should be run on the examples, FALSE if only to show examples
     * @return object An XML 'ul' node
     */
    /**
     * Parses a string to figure out the time it represents
     *
     * @param string s String to parse
     * @return Date a valid Date object
     * @throws Error
     */
    function parseTimeString(s) {
        for (var i = 0; i < timeParsePatterns.length; i++) {
            var re = timeParsePatterns[i].re;
            var handler = timeParsePatterns[i].handler;
            var bits = re.exec(s);
            if (bits) {
                return handler(bits);
            }
        }
        throw new Error("Invalid time string");
    }

    // changed comparing to the original version @Yilin Yao 2023/1/3
    function magicTime(input) {
        let el = input;
        if (input.value == '') {
            return;
        }
        try {
            var d = parseTimeString(input.value);
            input.value = getReadable(d);
        }
        catch (e) {
            try {
                var message = e.message;
                // Fix for IE6 bug
                if (message.indexOf('is null or not an object') > -1) {
                    message = 'Invalid time string';
                }
                el.value = message;
            } catch (e){} // no message div
        }
    }

    /*
        TODO: 
        User login
    */
    function init_login() {
        let ele = document.querySelector(LOG_IN_LOGO_ID);
        function to_login_page() {
            switch_page(document.querySelector(LOGIN_PAGE_ID));
        }
        ele.addEventListener('click', to_login_page);

        const LOGIN_CONFIRM_ID = '#login';
        const CREATE_USER_CONFIRM_ID = '#create_user';
        const LOG_IN_ERROR_MESSAGE_DISPLACEMENT_ID = '#login_error_hint';
        let login_ele = document.querySelector(LOGIN_CONFIRM_ID);
        let create_user_ele = document.querySelector(CREATE_USER_CONFIRM_ID);
        login_ele.addEventListener('click', confirm_log_in);
        create_user_ele.addEventListener('click', confirm_create_user);
        
        // return the username and password entered in the box. 
        function get_username_and_password() {
            let username_ele = document.querySelector(USERNAME_ID);
            let password_ele = document.querySelector(PASSWORD_ID);
            return [username_ele.value, password_ele.value];
        }

        async function confirm_log_in() {
            let combination = get_username_and_password();
            let username = combination[0];
            let password = combination[1];
            let hint = document.querySelector(LOG_IN_ERROR_MESSAGE_DISPLACEMENT_ID);
            try {
                hint.textContent = 'Logging In...';
                username_is_valid(username);
                password_is_valid(password);
                await fetch_valid_password_and_username(username, password);
                if (server_status.has_error) {
                    server_status.has_error = false;
                    throw new Error(server_status.error_message);
                }
                hint.textContent = 'loged in!';
                hint.style.color = 'green';
            } catch(e) {
                hint.style.color = 'darkred';
                hint.textContent = (e.message);
            }
        }

        async function confirm_create_user() {
            let combination = get_username_and_password();
            let username = combination[0];
            let password = combination[1];
            let hint = document.querySelector(LOG_IN_ERROR_MESSAGE_DISPLACEMENT_ID);
            try {
                hint.style.color = 'green';
                hint.textContent = 'Creating User...';
                password_is_valid(password);
                username_is_valid(username);
                await fetch_account_existed(username);
                await fetch_new_account(username, password);
                hint.textContent = 'Account Created!';
                
            } catch(e) {
                hint.style.color = 'darkred';
                hint.textContent = (e.message);
            }
        }

        // throw an error with error message if the username is not valid, otherwise does nothing
        function username_is_valid(str) {    
            if (
                str === undefined ||
                str == ''
            ) {
                throw new Error('Empty Username');
            }
        }

        function password_is_valid(str) {
            // TODO update this using regular expression
            if (
                str === undefined ||
                str == ''
            ) {
                throw new Error('Empty Password');
            }
            if (str.length < 7) {
                throw new Error('The Password Length Has to be Greater than 7');
            }
        }

        
    }

    // check if the account is already existed
    // if existed, return true, else throw
    async function fetch_account_existed(username) {
        let data = new FormData();
        data.append('username', username);
        let url = BASE_URL + EXIST_URL;
        try{
            let res = await fetch(url, {method: "POST", body: data});
            await status_check(res);
            await res.text()
                .then(text => {
                    if (text == 'exist') {
                        throw new Error('Username Exist');
                    }
                });
        } catch(e) {
            throw e;
        }
    }

    // create an account in the database
    async function fetch_new_account(username, password) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);
        let url = BASE_URL + CREATE_URL;
        try{
            let response = await fetch(url, {method: "POST", body: data});
            await status_check(response);
            await response.text()
                .then(res => {
                    if(res == 'Created') {
                        fetch_valid_password_and_username(username, password);
                    }else {
                        throw new Error(res);
                    }
                })
        } catch(e) {
            throw e;
        }
        
    }

    // check if the password and username is valid, returns the user id. 
    // if valid, return true, else return the error as text
    async function fetch_valid_password_and_username(username, password) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);
        let url = BASE_URL + LOGIN_ATTAMPT_URL;
        try {
            let response = await fetch(url, {method: "POST", body: data});
            await status_check(response);
            await response.text()
                .then(res => {
                    if (res != 'Passed') { // TODO change to version name
                        throw new Error(res);
                    } else {
                        loged_in = true;
                        global_password = password;
                        global_username = username;
                    }
                })
        } catch(e) {
            throw e;
        }
       
    }


    /*
        Below are helper functions
    */

    // given a page element, hide the current page and show the given element. 
    function switch_page(ele) {
        current_page_element.style.display = 'none';
        ele.style.display = 'block';
        current_page_element = ele;  
    }

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
        let arr = str.split(TIME_SEPERATOR);
        for (let i = 0; i < 3; i++) {
            if (arr[i].toString().length == 1) {
                arr[i] = '0' + arr[i];
            }
        }
        
        str = array_to_time(arr);
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

    function start_time_clicking() {
        let today = new Date();
        let time_begin = [today.getHours(), today.getMinutes(), today.getSeconds()];
        time_interval_id = setInterval(increment_time, ONE_SECOND, time_begin, time_passed.get(all_tasks_id_by_position[current_focus-GAP_BETWEEN_POSITION_AND_ACTUAL_ARRAY_POSITION]));
    }

    // increase the time by one second 
    // achieve by updating the difference time value 
    // take an array representing the time: [hours, mins, seconds]. 
    async function increment_time(time_begin, plus_time) {
        plus_time = plus_time.split(TIME_SEPERATOR);
        let today = new Date();
        let time_now = [today.getHours(), today.getMinutes(), today.getSeconds()];
        let new_time = [];
        for (let i = 0; i < LENGTH_OF_TIME_FOMAT + 1; i++) {
            new_time.push(time_now[i] - time_begin[i] + parseInt(plus_time[i]))
        }
        
        for (let i = new_time.length - 1; i > 0; i--) {
            while (new_time[i] < 0) {
                new_time[i-1]--;
                new_time[i] += 60
            }
        }
        
        set_time(array_to_time(new_time));
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
            if (str == '' || str === undefined) {
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
            for (let i = 0; i < current_tasks.length; i++){
                // if the name exists
                if (name == tasks_names.get(current_tasks[i]) ){
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
        storage_data_to_local_host();
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
        storage_data_to_local_host();
    }

    // return the defalt time
    function get_defalt_time (){
        let arr = ['00', '00', '00'];
        return array_to_time(arr);
    }

    function array_to_time(arr) {
        let ret = ""
        for(let i = 0; i < LENGTH_OF_TIME_FOMAT + 1; i++) {
            ret += arr[i];
            if (i!=LENGTH_OF_TIME_FOMAT) {
                ret += TIME_SEPERATOR;
            }
        }
        return ret;
    }

    // check the status of the promise
    // return the response of the promise if the status is good. 
    async function status_check(response) {
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return response;
    }

    function storage_data_to_local_host() {
        // serializable to form [[key,value],[key,value],...];
        localStorage.setItem('current_tasks', JSON.stringify(current_tasks));
        for (let i = 0; i < ALL_ATTRIBUTES.length; i++) {
            localStorage[ALL_ATTRIBUTES_NAMES[i]] = 
                JSON.stringify(Array.from(ALL_ATTRIBUTES[i].entries()));
        }
    }

    function read_data_from_local_host() {
        // setup current tasks list
        current_tasks = JSON.parse(localStorage.getItem('current_tasks'));
        for (let i = 0; i < ALL_ATTRIBUTES.length; i++) {
            // set all attributes
            ALL_ATTRIBUTES[i].clear();
            let temp_list = JSON.parse(localStorage[ALL_ATTRIBUTES_NAMES[i]]);
            for (let j = 0; j < temp_list.length; j++) {
                ALL_ATTRIBUTES[i].set(temp_list[j][0], temp_list[j][1]);
            }
        }
    }

    /*
        Below are extensions
        extensions need to return a div element to be added to the #extension div and append class '.extension_bar'
        in this extension, there need to be 
            a name append class '.extension_name'
            a descrption append class '.extension_description'
    */

    const EXTENSIONS_LIST = [color_extension];
    const EXTENSIONS_COUNT = EXTENSIONS_LIST.length;
    const EXTENSIONS_CONTAINER_DIV = '#extensions';
    const EXTENSION_SMALL_DIVS_CLASSNAME = 'extension_bar';
    const EXTENSION_LIGHT_DIVS_CLASSNAME = 'extension_light';
    let extension_is_active = new Map(); // Key = div element, Value = boolean 

    // function for adding an element to the extensions div
    // input: 
    //      the extension name, extension description, the functionality after the extension is active, the functionality after the extension is cancled. 
    function new_extension(name, description, active_functionality, cancle_functionality) {
        let container = document.querySelector(EXTENSIONS_CONTAINER_DIV);

        let new_ele = document.createElement('div');
        new_ele.className = EXTENSION_SMALL_DIVS_CLASSNAME; 

        let new_ele_light_bar = document.createElement('div');
        new_ele_light_bar.className = EXTENSION_LIGHT_DIVS_CLASSNAME;

        let new_ele_decription = document.createElement('p');
        new_ele_decription.className = 'extension_description'; 
        new_ele_decription.textContent = description;

        let new_ele_name = document.createElement('p');
        new_ele_name.className = 'extension_name';
        new_ele_name.textContent = name;

        new_ele.appendChild(new_ele_light_bar);
        new_ele.appendChild(new_ele_decription);
        new_ele.appendChild(new_ele_name);
        container.appendChild(new_ele);

        new_ele.addEventListener('mouseover', extension_light_on);
        new_ele.addEventListener('mouseout', extension_light_off);
        new_ele.addEventListener('click', extension_clicked);
        extension_is_active.set(new_ele, 0);

        function extension_clicked(ele) {
            // if this is already clicked, cancle
            let target = ele.target;
            if (target.className != EXTENSION_SMALL_DIVS_CLASSNAME) {
                target = target.parentElement;
            }
            extension_is_active.set(target, extension_is_active.get(target) ^ 1);
            if (!extension_is_active.get(target)) {
                extension_light_off(ele);
                cancle_functionality();
            } else {
                extension_light_on(ele);
                active_functionality();
            }
        }

        function extension_light_on(ele) {
            ele = ele.target;
            if (ele.className != EXTENSION_SMALL_DIVS_CLASSNAME) {
                ele = ele.parentElement;
            }

            let arr = document.querySelectorAll('.' + EXTENSION_LIGHT_DIVS_CLASSNAME);
            for (let i = 0; i < arr.length; i++) {
                if (ele.contains(arr[i])) {
                    arr[i].style.opacity = NON_DARK_LIGHT_OPACITY_FOR_TASK_LIGHT;
                    return;
                }
            }
        }

        function extension_light_off(ele) {
            ele = ele.target;
            if (ele.className != EXTENSION_SMALL_DIVS_CLASSNAME) {
                ele = ele.parentElement;
            }

            if (extension_is_active.get(ele)) {
                return;
            }

            let lights = document.querySelectorAll('.' + EXTENSION_LIGHT_DIVS_CLASSNAME);
            for (let i = 0; i < lights.length; i++) {
                if (ele.contains(lights[i])) {
                    lights[i].style.opacity = DARK_LIGHT_OPACITY_FOR_TASK_LIGHT;
                    return;
                }
            }
        }
        new_ele_light_bar.style.opacity = DARK_LIGHT_OPACITY_FOR_TASK_LIGHT;
    }

    // function for adding an element to the setting div
    // input: an element, the element that will be added. 
    // the element is recommended to apply the class .extension_bar
    function new_setting(ele) {
        let setting_div = document.querySelector('#settings');
        setting_div.appendChild(ele);
    }

    // function that init all the extensions
    function init_all_extensions() {
        for (let i = 0; i < EXTENSIONS_COUNT; i++) {
            EXTENSIONS_LIST[i]();
        }
    }

   /*
        @Yilin Yao
        2023/1/1
        Color extension - let user to change the main color as they wish
        return an element
    */
    function color_extension() {
        const NAME = 'Change Theme Color';
        const DESCRIPTION = 'Change the theme color of the web page to different colors!';
        const FUCNTIONALITY = action;
        const CANCLE_FUNCTIONALITY = cancle; 

        function action() {
            new_setting(new_setting_ele());
        }

        function cancle() {
            let ele = document.querySelector('#new_color_ele');
            ele.remove();
        }

        new_extension(NAME, DESCRIPTION, FUCNTIONALITY, CANCLE_FUNCTIONALITY);

        // returns a new setting element
        // element id = new_color_ele
        function new_setting_ele() {
            // Maybe simplify this later? 

            let overall_div = document.createElement('div');
            overall_div.className = 'extension_bar';
            overall_div.id = 'new_color_ele';
            
            let color_text = document.createElement('p');
            color_text.className = 'extension_name'
            color_text.textContent = 'Color:';

            let aviliable_colors = document.createElement('div');
            aviliable_colors.style.position = 'absolute';
            aviliable_colors.style.display = 'flex';
            aviliable_colors.style.top = '60px';
            aviliable_colors.style.left = '10px';
            aviliable_colors.style.height = '20px';
            aviliable_colors.style.width = '75%';
            aviliable_colors.style.overflow = 'auto';

                let green = document.createElement('span');
                let white = document.createElement('span');
                let blue = document.createElement('span');
                green.style.backgroundColor = '#60CF73';
                white.style.backgroundColor = '#e3e3e3';
                blue.style.backgroundColor = '#5BA9F1';
                let colors = [green, white, blue];
                for (let i = 0 ; i < colors.length; i++) {
                    colors[i].style.width = '20px';
                    colors[i].style.height = '20px';
                    colors[i].style.marginLeft = '20px';
                    colors[i].className = 'circle';
                    colors[i].addEventListener('click', (ele) => {
                        init_color(ele.target.style.backgroundColor);
                    })
                    aviliable_colors.appendChild(colors[i]);
                }


            let form = document.createElement('form');
            form.action = "/action_page.php";

            let lable = document.createElement('lable');
            lable.htmlFor = 'new_color';

            let new_color_input_box = document.createElement('textarea');
            new_color_input_box.style.position = 'absolute';
            new_color_input_box.style.right = '6%';
            new_color_input_box.style.height = '18px';
            new_color_input_box.style.backgroundColor= '#2C2C2C';
            new_color_input_box.style.fontFamily = 'Inter';
            new_color_input_box.style.fontStyle = 'normal';
            new_color_input_box.style.fontWeight = '400';
            new_color_input_box.style.fontSize = '8px';
            new_color_input_box.style.lineHeight = '12px';
            new_color_input_box.style.color = '#696969';
            new_color_input_box.style.border = '0';
            new_color_input_box.style.outline = 'none';
            new_color_input_box.style.resize = 'none';
            new_color_input_box.style.width = '60px';
            new_color_input_box.style.top = '60px';
            new_color_input_box.placeholder = '#123456';
            new_color_input_box.id = 'color_custom_input';

            let new_color_submit_buton = document.createElement('button');
            new_color_submit_buton.style.backgroundColor = '#2C2C2C';
            new_color_submit_buton.style.fontFamily = 'Inter';
            new_color_submit_buton.style.fontStyle = 'normal';
            new_color_submit_buton.style.fontWeight = '400';
            new_color_submit_buton.style.fontSize = '8px';
            new_color_submit_buton.style.fontWeight = '12px';
            new_color_submit_buton.style.color = '#696969';
            new_color_submit_buton.style.border = '0';
            new_color_submit_buton.style.outline = 'none';
            new_color_submit_buton.style.position = 'absolute';
            new_color_submit_buton.style.top = '37px';
            new_color_submit_buton.style.right = '6%';
            new_color_submit_buton.textContent = 'Change Color';
            new_color_submit_buton.type = "button";
            new_color_submit_buton.addEventListener('click', (ele) => {
                let color = document.querySelector('#color_custom_input').value;
                if (color.toLowerCase() == 'reccoon' || color.toLowerCase() == '浣熊') {
                    color = '#8D8581';
                }
                if (color == undefined) {
                    return;
                }
                try {
                    init_color(color);
                } catch(error) {
                    return;
                }
            })
            
            form.appendChild(lable);
            form.appendChild(new_color_input_box);
            form.appendChild(new_color_submit_buton);
            
            overall_div.appendChild(color_text);
            overall_div.appendChild(aviliable_colors);
            overall_div.appendChild(form);

            return overall_div;
        }

    }


    /*
        TODO: 
        @Yilin Yao
        2023/1/3
        Auto Sort - automatically sort the order of the current tasks list
        return an element representing the extension
    */


    




    /*
        Below codes will set up the lights and the initial styles of the web page. 
    */
    const ALL_CLASSES_OF_MAJOR_COLOR = [
        TASK_NAME_CLASS,
        BIG_TIME_CLASS,
        ALTERNATIVE_BIG_TIME,
        PREDICTED_TIME_CLASS
    ];

    const ALL_CLASSES_OF_MAJOR_BACKGROUND = [
        TASK_LIGHT_CLASS, 
        CIRCLE_IN_INFO_BOX_CLASS,
        EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS,
        '.extension_light'
    ];

    const ALL_DARK_NEEDED_CLASSES = [
        TASK_NAME_CLASS,
        TASK_LIGHT_CLASS,
        CIRCLE_IN_INFO_BOX_CLASS,
        EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS
    ]
    const ALL_DARK_OPACITYS = [
        DARK_LIGHT_OPACITY_FOR_TASK_NAME,
        DARK_LIGHT_OPACITY_FOR_TASK_LIGHT,
        DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE,
        DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE
    ]

    // #5BA9F1 - blue
    // #e3e3e3 - white 
    // #60CF73 - wechat green 
    const DEFULT_COLOR = '#e3e3e3';

    function init_styles(){
        init_color(DEFULT_COLOR);
        init_opacity();
    }

    function init_color(color) {
        for (let i = 0; i < ALL_CLASSES_OF_MAJOR_COLOR.length; i++) {
            let arr = document.querySelectorAll(ALL_CLASSES_OF_MAJOR_COLOR[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.color = color;
            }
        }

        for (let i = 0; i < ALL_CLASSES_OF_MAJOR_BACKGROUND.length; i++) {
            let arr = document.querySelectorAll(ALL_CLASSES_OF_MAJOR_BACKGROUND[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.backgroundColor = color;
            }
        }
        document.querySelector(PAGE_LEFT_ARROW_CLASS).style.borderRightColor = color;
        document.querySelector(PAGE_RIGHT_ARROW_CLASS).style.borderLeftColor = color;
    }

    function init_opacity() {
        for(let i = 0; i < ALL_DARK_NEEDED_CLASSES.length; i++) {
            let arr = document.querySelectorAll(ALL_DARK_NEEDED_CLASSES[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.opacity = ALL_DARK_OPACITYS[i];
            }
        }
    }

})();