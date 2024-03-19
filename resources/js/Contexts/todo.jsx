import { createContext, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import axios from 'axios';

const BASE_URL = 'http://todo-app.com/api/todo';
const TodoContext = createContext();

function TodoContextProvider({ children }) {

    const [todo, setTodo] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = (state) => {
        setIsModalOpen(state)
    }

    const getTodo = () => {
        axios.get(BASE_URL)
            .then(function (response) {
                setTodo(response.data.data)
            }).catch(function (error) {
                console.log(error)
            })
    }

    const prepareData = (label, description, duration, user_id = null) => {
        let preparedData = {};
        if (label !== '') preparedData['label'] = label;
        if (description !== '') preparedData['description'] = description;
        if (duration !== '') preparedData['duration'] = duration;
        if (user_id !== null) preparedData['user_id'] = user_id;
        return preparedData;
    }

    // TODO: Dynamic user_id by getting logged in user
    const addTask = ({ label, description, duration }) => {
        let preparedData = prepareData(label, description, duration, 1)
        axios.post(BASE_URL, preparedData)
        .then(function (response) {
            const updatedTodo = [
                ...todo,
                response.data.data
            ]
            setTodo(updatedTodo);
        }).catch(function (error) {
            console.log(error)
        })
    }

    const editTask = ({ id, label, description, duration }) => {
        let preparedData = prepareData(label, description, duration)
        axios.put(`${BASE_URL}/${id}`, preparedData)
        .then(function (response) {
            const updatedTodo = todo.map((task) => {
                if (task.id === id) {
                    return response.data.data
                }
                return task;
            })
            setTodo(updatedTodo);
        }).catch(function (error) {
            console.log(error)
        })
    }

    // const deleteMenuItem = (_id) => {
    //     axios.delete(`${BASE_URL}/${_id}`)
    //     .then(function (response) {
    //         const updatedMenu = menu.filter((item) => {
    //             return item.id !== id;
    //         })
    //         setMenu(updatedMenu);
    //     }).catch(function (error) {
    //             console.log(error)
    //         })
    // }

    const reorderTask = ({ id, prev_id, idIndex, overIdIndex }) => {
        // TODO: Fix this; set todo after retrieving new values from database
        setTodo(arrayMove(todo, idIndex, overIdIndex))
        axios.put(`${BASE_URL}/reorder/${id}`, {
            prev_id
        }).catch(function (error) {
            console.log(error)
        })
    }

    const valueToShare = {
        todo,
        getTodo,
        isModalOpen,
        toggleModal,
        addTask,
        editTask,
        // deleteMenuItem,
        reorderTask
    }

    return (
        <TodoContext.Provider value={valueToShare}>
            {children}
        </TodoContext.Provider>
    )
}

export { TodoContextProvider }
export default TodoContext;