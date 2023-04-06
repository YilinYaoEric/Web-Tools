import { useState } from "react";
const DescriptionArea = ({tasks_list, set_description, temp_foucs, finish_current_focus}) => {
    let task_description = (
        temp_foucs ? 
        tasks_list[temp_foucs].description
        :
        (tasks_list[0].id ? tasks_list[tasks_list[0].id].description : "")
    );

    const [mouseOn, setMouseOn] = useState(0);

    return (
        <div className="info_box">

            <form action="/action_page.php" className="new_task_form">
                <label htmlFor="info"></label>
                <textarea id="info" name="info" className="info" placeholder="Description"
                value={task_description} 
                onChange={(e) => {
                    set_description(tasks_list[0].id, e.target.value);
                }}
                readOnly={!tasks_list[0].id}
                ></textarea>
            </form>

            <div className="confirm_buttom" onMouseEnter={() => {setMouseOn(1)}}
            onMouseLeave={() => {setMouseOn(0)} }
            onClick ={ () => {finish_current_focus()}}
            style={{ cursor: "pointer" }}>
                <span id="confirm_task" className="circle" 
                style={
                    {visibility: tasks_list[0].id ? "visible" : "hidden",
                    opacity: mouseOn ? "1" : "0.5"}
                }
                >
                    <img    
                        alt="vector"
                        src="./Vector.png"
                        className="vector"
                        style={{visibility: tasks_list[0].id ? "visible" : "hidden"}}
                    />
                </span>

                
            </div>
                
        </div>
    );
}

export default DescriptionArea;