import Task from './task.js';

/**
 * pre: the first 4 element in the tasks_list, which has the key 1,2,3,4 will 
 * be required. 
 * @param {list} tasks_list a list of tasks that has been adjusted using the
 * function defined in task_page.js 
 * @param {function} clicked_task affect after clicking a task
 * @param {function} set_light set the light value of the given task id
 * This should take params: set_light(id, value)
 * @param {function} set_temp_focus set the temp focus to be the given task id
 * @param {function} add_page_num flip the page by a certain number
 * @returns 
 */
const TasksArea = ({tasks_list, clicked_task, set_light, set_temp_focus, add_page_num}) => {


    /**
     * create a task with using value in tasks and task id 
     * @param {*} id the task id
     * @returns a div represent a task
     */
    let get_one = (id) => {
        if (!tasks_list[id]) {
            console.log(tasks_list[0].page);
            console.log("failed to access id = " + id)
            console.log("Printing tasks_list");
            console.log(tasks_list);
            throw Error("need to adjuest list");
        }
        return (
            <Task id={id} list={tasks_list} clicked_task={clicked_task} set_light={set_light}
            set_temp_focus={set_temp_focus}/>
        );
    }

    const page = tasks_list[0].page*4;
    
    return (
        <>
            {get_one(page+1)}

            <div className="helper_block">
                {get_one(page+2)}

                <div className="tasks_left_arrow" onClick={() => (add_page_num(-1))}
                style={{ cursor: "pointer" }}></div>
                <div className="tasks_right_arrow" onClick={() => (add_page_num(1))}
                style={{ cursor: "pointer" }}></div>
            </div>

            {get_one(page+3)}
            {get_one(page+4)}
        </>
    );
}

export default TasksArea;