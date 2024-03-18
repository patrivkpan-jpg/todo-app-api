import { createContext, useState, useEffect } from "react";
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

    // TODO: Dynamic task id to edit
    const editTask = ({ label, description, duration }, id = 1) => {
        let preparedData = prepareData(label, description, duration)
        console.log(preparedData)
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

    const valueToShare = {
        todo,
        getTodo,
        isModalOpen,
        toggleModal,
        addTask,
        editTask,
        // deleteMenuItem
    }

    return (
        <TodoContext.Provider value={valueToShare}>
            {children}
        </TodoContext.Provider>
    )
}

export { TodoContextProvider }
export default TodoContext;