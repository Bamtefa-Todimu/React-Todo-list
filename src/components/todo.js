import React ,{useState,useEffect,useRef} from 'react'
import './todo.css'
import './tasks.css'
import banner from '../images/bg-desktop-dark.jpg'
import sunIcon from '../images/icon-sun.svg'
import deleteIcon from '../images/icon-cross.svg'
import completedIcon from '../images/icon-check.svg'

const Todo = () => {

    const [tasks,setTasks] = useState([])
    const [value,setValue] = useState("")
    const [sub,setSubmit] = useState(0)
    const [deletedTask, setDelete] = useState(0)
    const [clearValue, setClear] = useState("")
    const [comp, setCompleted] = useState(0)

    const allTasks = useRef([])
    const completedTasks = useRef((allTasks.current.filter((task) => task.completed === true))
        )
    const incompletedTasks = useRef((allTasks.current.filter((task) => task.completed === false))
        )

    const firstRender = useRef(false)
    const firstRender2 = useRef(false)
    const firstRender3 = useRef(false)


    const handleDelete = () =>{
        setDelete(deletedTask+1)
    }

    const handleDeleteCompleted = async () =>{
        const clearCompleted = await fetch('http://localhost:5000/deleteCompletedItems',
        {
           method:'DELETE',
           body:JSON.stringify({completed:true}),
           headers:{
               'Content-type': 'application/json; charset=UTF-8'
           }
        })
    }


    const handleChange = (e) => {
        console.log(e.target.value);
        setValue(e.target.value)
    }

    const handleSubmit = async () => {
        const sendTask = await fetch('http://localhost:5000/saveItem',
        {
           method:'POST',
           body:JSON.stringify({"name":value}),
           headers:{
               'Content-type': 'application/json; charset=UTF-8'
           }
        })

    }

    useEffect(() => {

        if(firstRender.current === false)
        {
            firstRender.current = true
            return
        }
        handleSubmit()
        fetchTasks()
    },[sub])

    useEffect(() => {
        if(firstRender2.current === false)
        {
            firstRender2.current = true
            return
        }
        handleDeleteCompleted()
        fetchTasks()
        setClear("")
    },[clearValue])

    
    useEffect(() => {
         fetchTasks()
         console.log("a");
    },[sub,deletedTask,clearValue,comp])

    // useEffect(() =>{
        
    //     console.log(tasks);
    //     })

    const fetchTasks  = async () =>{
    
        const tasks = await fetch('http://localhost:5000/allItems')
        const data = await tasks.json()
        allTasks.current = data
        completedTasks.current = (data.filter((task) => task.completed === true))
        incompletedTasks.current = (data.filter((task) => task.completed !== true))
        console.log("fetching");
        setTasks(data)
    }

    


  return (
    <>
        <div className="banner-container">
            <img src={banner} alt="" />    
        </div>

        <div className="todo-container">
            <div className="todo-header">
                <h1 className = 'todo-header-text'>TODO</h1>
                <div className="todo-header-img">
                    <img src={sunIcon} alt="" />    
                </div>
            </div>  

            <div className="create-new-container">
                <div className="create-icon" onClick={() => setSubmit(sub +1)}></div>
                <input type="text" className="create-new-input" placeholder='Type here and click left circle...' onChange={handleChange}/>
            </div> 
            <div className = "tasks-container-general">

                { tasks.map((task,index) => {
                    // console.log(...tasks);
                     return <Tasks key = {task._id} {...task} deleteItem = {handleDelete} renderCompleted = {()=>setCompleted(comp+1)} />
                })}

                

            </div>

            <div className="task-container-footer">
                    <p className="items-left">{tasks.length} items left </p>
                    <div className="categories-container">
                        <button onClick={() => setTasks(allTasks.current)}>All</button>    
                        {/* <button onClick={() => setTasks(incompletedTasks.current)}>Active</button>     */}
                        <button onClick={() => setTasks(completedTasks.current)}>Completed</button>    
                    </div>    
                    <p className="clear-btn" onClick = {() => setClear(true)}>Clear Completed</p>    
                </div>
        </div>
    </>
  )
}



const Tasks = (props) => {


    const {_id,name,completed,deleteItem,renderCompleted} = props
    const [deleteId,setDeleteId] = useState("bbbbbbbbbbbbbbbbbbbbbbbb")
    const [updatedId,setUpdatedId] = useState("bbbbbbbbbbbbbbbbbbbbbbbb")
    // const [isComplete ,setCompleted] = useState(completed)

    const fRender1 = useRef(false)
    const fRender2 = useRef(true)

    const isComplete = useRef(completed)

    const handleCompleted = async () =>{
        const completeTask = await fetch(`http://localhost:5000/updateItem/${updatedId}`,
        {
           method:'post',
        })
    }

    const handleDelete  = async() => {
        
        const deleteTask = await fetch(`http://localhost:5000/deleteItem/${deleteId}`,
        {
           method:'delete',
        })

    }

    useEffect(() => {
        if(fRender1.current === false)
        {
            fRender1.current = true
            return
        }
        handleCompleted()
        renderCompleted()
        // console.log(updatedId);
        
    },[updatedId])

    useEffect(() => {
        if(fRender2.current === false)
        {
            fRender2.current = true
            return
        }
        handleDelete()
        // console.log(deleteId);
        deleteItem()
    },[deleteId])

  return (
    <>
        <div className="task-container" id = {_id}>
            <div className="completed-icon" onClick={(e) => {setUpdatedId(e.target.parentNode.parentNode.id);isComplete.current = true}}>
                {!isComplete.current && <div className = "icon-cover">
                    
                    </div>}
                <img src={completedIcon} alt="" />    
            </div>

            {(isComplete.current)?
                <del style={{color: "hsl(238, 15%, 38%)"}}><div className="task-name">
                    
                    {name.charAt(0).toUpperCase() + name.substring(1,name.length)}
                </div></del>
            :
            <div className="task-name">
                    {name.charAt(0).toUpperCase() + name.substring(1,name.length)}
                </div>
            }
            

            <div className="delete-task-btn" onClick={(e) => setDeleteId(e.target.parentNode.parentNode.id)}>
                <img src={deleteIcon} alt="" />    
            </div>
        </div>
    </>
  )
}





export default Todo