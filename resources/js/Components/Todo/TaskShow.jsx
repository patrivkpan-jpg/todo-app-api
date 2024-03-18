import { useState } from "react";

function TaskShow ({ task, onEditButtonClick }) {

    const duration = (task.duration === null) ? '' : 
    <div className="task-item-duration">
        <h4>Duration: </h4>
        <p>
            {task.duration} minute/s
        </p>
    </div>

    return (
        <div className="task-item-cont">
            <div className="task-item">
                <div className="task-item-details">
                    <h2>
                        {task.label}
                    </h2>
                    <p>
                        {task.description}
                    </p>
                </div>
                <div className="task-item-edit">
                    <i className="edit-task-button far fa-edit" onClick={onEditButtonClick}></i>
                </div>
                {duration}
                <div className="task-item-drag">
                    <i className="fa-solid fa-grip"></i>
                </div>
            </div>
        </div>
    )
}

export default TaskShow;