import React, { useState } from 'react'

function TaskInput({addTask}) {
    const [task, setTask] = useState("");

    function handleSubmit(e){
        e.preventDefault();

        if(!task.trim()) return;
        addTask(task);
        setTask("");
    }


  return (
    <div>
        <form onSubmit={handleSubmit} className='task-input'>
            <input 
            type="text"
            value={task} 
            onChange={(e)=> setTask(e.target.value)}
            placeholder='Enter a task...'
            />

            <button type='submit' >Add Task</button>
        </form>
    </div>
  )
}

export default TaskInput