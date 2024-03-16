
function TaskShow ({ task }) {
    return (
        <div className="task-item-cont">
            <div className="task-item">
                <div className="task-item-details">
                    <h2>
                        {task.label}
                    </h2>
                    <h3>
                        {task.description}
                    </h3>
                </div>
                <div className="task-item-edit">
                    <i className="far fa-edit"></i>
                </div>
                <div className="task-item-duration">
                    <h4>Duration: </h4>
                    <p>
                        {task.duration} minute/s
                    </p>
                </div>
                <div className="task-item-drag">
                    <i class="fa-solid fa-grip"></i>
                </div>
            </div>
            {/* <div className="task-item-bottom">
                <div className="task-item-duration">
                    <h3>Duration: </h3>
                    <p>
                        {task.duration} minute/s
                    </p>
                </div>
                <div className="task-item-drag">
                    <i class="fa-solid fa-grip"></i>
                </div>
            </div> */}
        </div>
    )
}

export default TaskShow;