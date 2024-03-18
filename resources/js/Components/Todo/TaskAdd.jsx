import useTodoContext from "../../Hooks/use-todo-context";
import TaskModal from "./TaskModal";

function TaskAdd ({ modalOpen, onModalClose }) {
    
    const { addTask } = useTodoContext();

    return (
        <TaskModal modalOpen={modalOpen} onModalClose={onModalClose} action={addTask} />
    )
}

export default TaskAdd;