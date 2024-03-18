import { useState, useEffect } from "react";
import useTodoContext from "../Hooks/use-todo-context";
import TaskList from "../Components/Todo/TaskList";
import TaskAdd from "../Components/Todo/TaskAdd";
import TaskEdit from "../Components/Todo/TaskEdit";
import TaskModal from "../Components/Todo/TaskModal";

function Home () {

    const { getTodo, addTask, editTask, isModalOpen, toggleModal } = useTodoContext();

    const [modalAction, setModalAction] = useState(() => addTask);

    const openModal = (event) => {
        const actions = {
            'add-task-button' : () => addTask,
            'edit-task-button' : () => editTask
        }
        setModalAction(actions[event.target.classList[0]])
        toggleModal(true)
    }

    const closeModal = (event) => {
        event.preventDefault()
        toggleModal(false)
    }

    useEffect(() => {
        getTodo()
    }, [])

    return (
        <div className="main">
            <div className="banner">
                <h1>TODO</h1>
            </div>
            <button className='add-task-button' onClick={openModal}>Add Task</button>
            <TaskList onEditButtonClick={openModal} />
            <TaskModal modalOpen={isModalOpen} onModalClose={closeModal} action={modalAction} />
            {/* <TaskAdd modalOpen={isModalOpen} onModalClose={closeModal} />
            <TaskEdit modalOpen={isModalOpen} onModalClose={closeModal} />  */}
        </div>
    )
}

export default Home;