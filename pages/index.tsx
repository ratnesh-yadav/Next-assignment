import { useEffect, useState } from 'react';
import axios from 'axios';
import { Task } from '@/types/task';
import "../app/globals.css"

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);//Array to store Tasks
  const [filter, setFilter] = useState('all');//Store the current selected filter for Filter Section
  const [newTask, setNewTask] = useState('') // Store new task title as String
  const [newDescription, setNewDescription] = useState('') //Store new Task decsription as String
  const [activeTask, setActiveTask] = useState(null)  //Store which Task is selected bu user to perform actions like delete task or change status
  const [newTaskMenu, setNewTaskMenu] = useState(false)// Store states of new Task menu

  useEffect(() => {
    fetchTasks();
  }, [filter]);


  //A function to call API in order to fetch Tasks from db and make it visible on the UI
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getTask?filter=${filter}`);

      if (Array.isArray(res.data.data)) {
        setTasks(res.data.data);
      }

      else if (res.data.tasks && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      }
      else {
        console.error("Unexpected data format:", res.data);
        setTasks([]);
      }
    } catch (err) {
      console.log("---36----", err)
    }
  };

  // A fucntion to call API in order to add new Task to DB
  const addTask = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createTask`, { title: newTask, description: newDescription });
      setNewTask('') // Clear newTask
      setNewDescription('') //Clera newDescription
      fetchTasks() // Callling fetchTasks
    } catch (err) {
      console.log("---47---", err)
    }
  }


  // A function to call API in order to change the states of Task, like done, in progress and etc.
  const toggleComplete = async (id: any, status: any) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
        status: status,
      });
      fetchTasks()
    } catch (err) {
      console.log("---17----", err)
    }
  };

  // A function to call API in order to delete a task with desiret TASK ID
  const deleteTask = async (id: any) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.log('----26----', err)
    }
  };

  // A Function for filtering the Tasks in the UI
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter
  })

  return (
    <div className="bg-slate-50">
      {/* Header Section to show profile picture and add- new task button */}
      <div className="grid grid-flow-col justify-between px-3 mb-4 pt-3">
        <div className="text-black">
          <img src="profile.jpg" alt="your pic" width={60} className="rounded-full"></img>
        </div>
        <button className="text-white bg-black px-6 py-3 rounded-full text-2xl" onClick={() => setNewTaskMenu(true)}> + </button>
      </div>

      {/* Section add New Task */}
      {newTaskMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-40">
          <div className="bg-white w-3/4 max-w-md mx-auto rounded-lg p-6 text-center space-y-3 space-x-2">
            <h1 className="text-gray-700 text-2xl">Add new Task</h1>
            <input
              type="text"
              className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
              placeholder="Task Name"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="text"
              className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
              placeholder="Task Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button
              className="bg-green-500 text-white w-1/2 mx-auto px-4 py-2 rounded-full"
              onClick={addTask}
            >
              Add Task
            </button>
            <button
              className="border-2 border-red-500 text-red-500 w-1/2 mx-auto px-4 py-2 rounded-full"
              onClick={() => setNewTaskMenu(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Section to show filter menu */}
      <div className="filter-section grid grid-flow-col px-3 space-x-2 pb-4">
        <button
          className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
            }`} onClick={() => setFilter("all")}>
          All
        </button>
        <button
          className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'done' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
            }`} onClick={() => setFilter("done")}>
          Done
        </button>
        <button
          className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'in-progress' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
            }`} onClick={() => setFilter("in-progress")}>
          In progress
        </button>
        <button
          className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'under-review' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'
            }`} onClick={() => setFilter("under-review")}>
          Under Review
        </button>

      </div>

      {/* Section to show Tasks */}
      <ul className="grid">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`relative grid grid-flow-row items-center mb-1 rounded-3xl text-lg
                ${task.status === 'done' ? 'bg-green-500' : task.status === 'under-review' ? 'bg-slate-400' : 'bg-cyan-600'} 
                m-2 px-4 font-light`}
            >
              <div className="grid grid-cols-3">
                <div className="col-span-2">
                  <div className="mt-4 pb-4 text-gray-100">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setActiveTask(task._id)}
                    >
                      {task.title}
                    </div>
                    <div className="text-xs mt-6">{task.description}</div>
                  </div>
                </div>
                <div className="grid">
                  <div className="text-center text-xs text-gray-50 border-2 border-gray-50 m-auto px-3 py-1 rounded-full">
                    {task.status.replace('-', ' ')}
                  </div>
                </div>
              </div>

              {/* Full Screen pop up Modal for actions menu */}
              {activeTask === task._id && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex flex-col justify-center items-center p-4 z-20">
                  <div className="grid grid-flow-row space-y-2 text-balse">
                    {['done', 'in-progress', 'under-review'].map((status) => (
                      <button
                        key={status}
                        className={`${status === 'done'
                            ? 'bg-green-500'
                            : status === 'in-progress'
                              ? 'bg-cyan-600'
                              : 'bg-slate-400'
                          } text-white px-4 py-2 rounded-full`}
                        onClick={() => {
                          toggleComplete(task._id, status as Task['status']);
                          setActiveTask(null);
                        }}
                      >
                        Mark as {status.replace('-', ' ')}
                      </button>
                    ))}
                    <button
                      className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
                      onClick={() => {
                        deleteTask(task._id);
                        setActiveTask(null);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="border-2 border-gray-500 text-gray-500 px-4 py-2 rounded-full"
                      onClick={() => setActiveTask(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>

    </div>
  )
};

export default Home;
