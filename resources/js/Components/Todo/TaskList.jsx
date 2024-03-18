import TaskShow from "./TaskShow";
import useTodoContext from "../../Hooks/use-todo-context";

function TaskList ({ onEditButtonClick }) {

    const { todo } = useTodoContext();

    // const todo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    // const todo = [1, 2]
    
    const renderedTaskList = todo.map((task) => {
        return <TaskShow key={task.id} task={task} onEditButtonClick={onEditButtonClick} />
    })
    return (
        <div className="task-list">
            { renderedTaskList }
        </div>
    )
}

export default TaskList;