import { useState } from "react";
import {Time_passed} from "../time.js"; 

/**
 * this will add new tasks to the tasks_list when user wants.
 * @param {function} new_task calling this function create a new task in the tasks_list 
 * @returns a div representing the new task area
 */
const NewTaskArea = ({new_task}) => {
    const [name, set_name] = useState();
    const [hours, set_hours] = useState();
    const [minutes, set_minutes] = useState();
    const [seconds, set_seconds] = useState();
    const [description, set_description] = useState();

    const [mouse_in, set_mouse_in] = useState(0);

    return (
        <div className="extention_block">

            <p className="extention_name">
                NEW TASK
            </p>

            <form action="/action_page.php" className="new_task_form">
                <Input placeholder={"Name"} id={"task_name"} className={"new_task_form_properties"} 
                value={name} change_value={set_name} next_element={0}/>


                <div className="new_task_form_time_div">
                    <Input placeholder={"00"} id={"task_time"} className={"new_task_form_time"} 
                    value={hours} change_value={set_hours} label={" h "} next_element={"#task_minutes"}/>

                    <Input placeholder={"00"} id={"task_minutes"} className={"new_task_form_time"}
                    value={minutes} change_value={set_minutes} label={" m "} next_element={"#task_seconds"}/>

                    <Input placeholder={"00"} id={"task_seconds"} className={"new_task_form_time"}
                    value={seconds} change_value={set_seconds} label={" s "} next_element={"#description"}/>
                </div>
                
                
                <label htmlFor="description"></label>
                <textarea id="description" name="description" rows="4" cols="50" 
                className="new_task_form_properties" placeholder="Hints" value={description} 
                onChange={(e) => {set_description(e.target.value)}}></textarea>
            </form>

            <div className="confirm_buttom"
                onMouseEnter={() => {set_mouse_in(1)}}
                onMouseLeave={() => {set_mouse_in(0)}} 
                onClick={() => {
                    let h = hours ? hours : 0;
                    let m = minutes ? minutes : 0;
                    let s = seconds ? seconds : 0;
                    let n = name ? name : "undefined task";
                    let des = description ? description : "";
                    new_task(n, des, new Time_passed(parseInt(h|0), parseInt(m|0), parseInt(s|0)));
                    set_name("");
                    set_hours("");
                    set_minutes("");
                    set_seconds("");
                    set_description("");
                }}
                style={{ cursor: "pointer" }}>
                <span id="confirm_new_task" className= {mouse_in ? "circle" : "circle dim"}></span>

                <img
                    alt="vector"
                    src="./Vector.png"
                    className="vector"
                    
                />
            </div>
        </div>
    );
};

/**
 * @param {string} placeholder placeholder of the returning input 
 * @param {string} id id of the returning input 
 * @param {string} className class name of the new input
 * @param {string} label prefix before the input
 * @param {string} value value of the input
 * @param {function} change_value change the value to the given param
 * @param {string} next_element the id of next element. if next_element is implemented,
 * then whenever the value length > 1, the focus is moved on to next element. To not implement it,
 * use undefined.
 * @returns an input element
 */
const Input = ({placeholder, id, className, label, value, change_value, next_element}) => {
    let first_change = false
    return (
        <>
            <input type="text" id={id} name={id} placeholder={placeholder} className={className}
            value={value}
            onChange={(e) => {change_value(e.target.value);}}
            onKeyUp={next_element && value && value.length > 1 && !first_change ? () => {
                document.querySelector(next_element).focus()
                first_change = true
                } : ()=>{}}></input>
            <label htmlFor={id}>{label}</label>
        </>
    )
}

export default NewTaskArea;