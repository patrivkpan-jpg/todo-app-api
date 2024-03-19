import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

function TaskShow ({ task, onEditButtonClick }) {

    const {
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition
    } = useSortable({ id: task.id })

    const draggableStyle = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const duration = (task.duration === null) ? '' : 

    <div className="task-item-duration">
        <h4>Duration: </h4>
        <p>
            {task.duration} minute/s
        </p>
    </div>

    const onEditClick = (event) => {
        onEditButtonClick(event, {
            id: task.id,
            label: task.label,
            description: task.description ?? '',
            duration: task.duration ?? '',
        })
    }

    return (
        <div 
        ref={setNodeRef}
        style={draggableStyle}
        {...attributes}
        {...listeners}
        className="task-item-cont">
            <div className="task-item">
                <div className="task-item-details">
                    <h2>
                        {task.label} {task.id}
                    </h2>
                    <p>
                        {task.description}
                    </p>
                </div>
                <div className="task-item-edit">
                    <i className="edit-task-button far fa-edit" onClick={onEditClick}></i>
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