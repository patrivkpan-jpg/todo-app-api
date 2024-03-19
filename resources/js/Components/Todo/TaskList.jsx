import TaskShow from "./TaskShow";
import useTodoContext from "../../Hooks/use-todo-context";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

function TaskList ({ onEditButtonClick }) {

    const { todo, reorderTask } = useTodoContext();

    const [ todoList, setTodoList ] = useState(todo)

    useEffect(() => {
        setTodoList(todo)
    }, [todo])

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    })

    const sensors = useSensors(pointerSensor)
    
    const renderedTaskList = todoList.map((task) => {
        return <TaskShow key={task.id} task={task} onEditButtonClick={onEditButtonClick} />
    })

    const onDragEnd = (event) => {
        const activeId = event.active.id;
        const overId = event.over.id;
        if (activeId === overId) return;
        const idList = todoList.map((task) => {
            return task.id
        })
        const activeIdIndex = idList.indexOf(activeId)
        const overIdIndex = idList.indexOf(overId)
        let prevId = overId;
        if (overIdIndex < activeIdIndex) {
            let prevTask = todoList.find(task => {
                return task.next_id === overId
            })
            if (typeof prevTask === 'undefined') {
                prevId = null
            } else {
                prevId = prevTask.id
            }
        }
        reorderTask({ id: activeId, prev_id: prevId, idIndex: activeIdIndex, overIdIndex: overIdIndex })
    }

    return (
        <div className="task-list">
            <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
                <SortableContext items={todoList} strategy={verticalListSortingStrategy}>
                    { renderedTaskList }
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default TaskList;