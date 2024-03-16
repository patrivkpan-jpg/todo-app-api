import { useEffect } from "react";
import useTodoContext from "../Hooks/use-todo-context";
import TaskList from "../Components/Todo/TaskList";

function Home () {

    const { getTodo } = useTodoContext();

    useEffect(() => {
        getTodo()
    }, [])

    return (
        <div className="main">
            <div className="banner">
                <h1>TODO</h1>
            </div>
            <TaskList />
        </div>
    )
}

export default Home;