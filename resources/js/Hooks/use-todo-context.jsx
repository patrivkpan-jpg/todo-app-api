import { useContext } from "react";
import TodoContext from '../Contexts/todo';

function useTodoContext() {
    return useContext(TodoContext)
}

export default useTodoContext;