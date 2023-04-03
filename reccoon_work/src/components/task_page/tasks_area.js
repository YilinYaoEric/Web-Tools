import Task from './task.js';

// pre: the first 4 element in the tasks_list, which has the key 1,2,3,4 will 
// be required. 
const TasksArea = ({tasks_list, clicked_task, set_light, set_temp_focus, add_page_num}) => {
    // id, text_content, is_light, hover_effect, 
    // cancle_hover_effect, click_effect

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