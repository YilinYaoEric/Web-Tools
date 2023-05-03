import {Time_passed} from "../time.js"
/**
 * 
 * @param {list} tasks_list a list of tasks
 * @param {number} temp_foucs a task id representing the temp focus, 0 if ther is no temp focus
 * @returns 
 */
const TimeArea = ({tasks_list, temp_foucs}) => {
    let time_passed = (
        temp_foucs ? 
        tasks_list[temp_foucs].time_passed
        :
        (tasks_list[0].id ? tasks_list[tasks_list[0].id].time_passed : new Time_passed(0,0,0))
    );
    let predicted_time = (
        temp_foucs ? 
        tasks_list[temp_foucs].predicted_time
        :
        (tasks_list[0].id ? tasks_list[tasks_list[0].id].predicted_time : new Time_passed(0,0,0))
    );
    return (
        <div className="time">
            <p className="big_time" id="first_time">
                {time_passed.to_string()}
            </p>

            <p className="predict_time">Predicted: {predicted_time.to_string()}</p>
        </div>
    )
    
}

export default TimeArea;