import useTodoContext from "../../Hooks/use-todo-context";
import TaskModal from "./TaskModal";

function TaskEdit ({ modalOpen, onModalClose }) {
    
    const { editTask } = useTodoContext();

    return (
        <TaskModal modalOpen={modalOpen} onModalClose={onModalClose} action={editTask} />
    )
}

export default TaskEdit;