import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import useTodoContext from "../../Hooks/use-todo-context";

function TaskModal ({ modalOpen, onModalClose, action, taskDetails }) {
    
    const { editTask } = useTodoContext();

    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#76abae'
        },
    };

    const [isOpen, setIsOpen] = useState(modalOpen)
    
    useEffect(() => {
        setIsOpen(modalOpen)
    }, [modalOpen])

    const [newTask, setNewTask] = useState(taskDetails)
    
    useEffect(() => {
        setNewTask(taskDetails)
    }, [taskDetails])

    const onFormSubmit = (event) => {
        action(newTask)
        setNewTask({
            label: '',
            description: '',
            duration: ''
        })
        onModalClose(event)
    }

    const onFormValuesChange = (event) => {
        const taskKey = {
            'task-label-input': 'label',
            'task-desc-input': 'description',
            'task-duration-input': 'duration'
        }
        let newTaskValues = newTask;
        newTaskValues[taskKey[event.target.id]] = event.target.value
        setNewTask(newTaskValues)
    }

    return (
        <ReactModal isOpen={isOpen}
        bodyOpenClassName={'hide-overflow'}
        style={modalStyle}
        preventScroll={true}
        contentLabel={action + 'a Task'}>
            <form>
                <h2>{action} a Task</h2>
                <button onClick={onModalClose}>x</button>
                <hr />
                <input type='text' id='task-label-input' required defaultValue={newTask.label} onChange={onFormValuesChange}></input>
                <textarea id='task-desc-input' defaultValue={newTask.description} onChange={onFormValuesChange}></textarea>
                <input type='number' id='task-duration-input' defaultValue={newTask.duration} onChange={onFormValuesChange}></input>
                <hr />
                <button onClick={onFormSubmit}>Submit</button>
            </form>
        </ReactModal>
    )
}

export default TaskModal;