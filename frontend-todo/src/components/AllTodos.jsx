import axios from 'axios';

function AllTodos ({title, setTitle, description, setDescription, todos,getTodos,editId,setEditId,handleTitleEvent,handleDescriptionEvent}){

    async function handleEdit(id){
        if(!editId){
            setEditId(id);
        }else{
            await axios.put(`http://localhost:4000/todos?id=${id}`,{
                title,
                description
            });
            setTitle("");
            setDescription(""); 
            getTodos();
            setEditId("")
        }
    }

    async function handleComplete(id){
        console.log("this is ID:",id);
        await axios.put(`http://localhost:4000/todos?id=${id}`,{
            task:"complete"
        });
        getTodos();
    }

    return (
    <div className="todos">
        {todos.map((todo, index) => (
            <div key={index} className="todoItem">
                {editId===todo._id?
                    <div>
                        <input className="ediTitle" type="text" onChange={handleTitleEvent} placeholder="Title" />
                        <input className="editDescription" type="text" onChange={handleDescriptionEvent} placeholder="Description" />
                    </div>:
                    <div>
                        <h2 className="todoTitle">{todo.title}</h2>
                        <p className="todoDescription">{todo.description}</p>
                    </div>
                }
                {editId===todo._id?
                <span><button className="todoCancel" onClick={()=>{getTodos()}}>Cancel</button></span>
                :<span><button className="todoComplete" onClick={()=>{handleComplete(todo._id)}}>Complete</button></span>
                }
                {editId===todo._id?<span><button className="submitTodo" onClick={()=>{handleEdit(todo._id)}}>submit</button></span>
                :<span><button className="editTodo" onClick={()=>{handleEdit(todo._id)}}>Edit Todo</button></span>}
                
            </div>
        ))}
    </div>)
}

export default AllTodos