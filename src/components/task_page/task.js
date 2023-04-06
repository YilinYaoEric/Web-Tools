import React from 'react';

// pre: id need to be between 1-4 for locating this task's position
// text_content should be the title of the task 
// is_light means if the task need to be highlighted
// hover_effect, cancle_hover_effect, and click_effect need to be functions
const Task = ({list, id, clicked_task, set_light, set_temp_focus}) => {
    return (
        <div 
            className={'task' + ((id-1)%4+1).toString()} 
            onClick={() => {clicked_task(id);}}
            onMouseEnter={
                list[id].active && id!==list[0].id ? () => {set_light(id, 1); set_temp_focus(id);} : () => {}
            } 
            onMouseLeave={
                list[id].active && id!==list[0].id ? () => {set_light(id, 0); set_temp_focus(0);} : () => {}
            }
            style={{ cursor: "pointer" }}
        >
            <div className={list[id].is_light ? "active_task_light" : "task_light"} ></div>

            <p className={list[id].is_light ? "task_name" : "task_name dim"}>
                {list[id].text_content}
            </p>
        </div>
    );
}

export default Task;