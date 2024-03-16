import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = 'http://todo-app.com/api/todo';
const TodoContext = createContext();

function TodoContextProvider({ children }) {
    const [todo, setTodo] = useState([]);

    // useEffect(() => {
    //     console.log('menu', menu)
    // }, [menu])

    const getTodo = () => {
        axios.get(BASE_URL)
            .then(function (response) {
                setTodo(response.data.data)
            }).catch(function (error) {
                console.log(error)
            })
    }

    // const addMenuItem = ({ name, description, price, image }) => {
    //     axios.post(BASE_URL, {
    //         name, description, price, image
    //     },{
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     }).then(function (response) {
    //         const updatedMenu = [
    //             ...menu,
    //             response.data.data
    //         ]
    //         setMenu(updatedMenu);
    //     }).catch(function (error) {
    //         console.log(error)
    //     })
    // }

    // const editMenuItem = (_id, { description, price }) => {
    //     axios.put(BASE_URL, {
    //         _id, description, price,
    //     }).then(function (response) {
    //         const updatedMenu = menu.map((item) => {
    //             if (item.id === id) {
    //                 return response.data.data
    //             }
    //             return item;
    //         })
    //         setMenu(updatedMenu);
    //     }).catch(function (error) {
    //         console.log(error)
    //     })
    // }

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
        // addMenuItem,
        // editMenuItem,
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