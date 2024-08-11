import {useEffect, useState} from "react";
import './style.css'
import AllTodos from './AllTodos'
import SearchTodo from "./SearchTodo";
import ResponseTodos from "./ReponseTodos";
import axios from 'axios';

function Home (){
    const [todos,setTodos] = useState([]);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editId,setEditId] = useState("")
    const [isSearch, setIsSearch] = useState(false);
    const [searchValue,setSearchValue] = useState("");

    function handleTitleEvent(event) {setTitle(event.target.value);}
    function handleDescriptionEvent(event) {setDescription(event.target.value);}

    async function createTodo(title, description) {
        try {
            await axios.post("http://localhost:4000/todos", {title, description})
            setTitle("");
            setDescription(""); 
            getTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    }

    const getTodos = async ()=>{
        const response = await axios.get('http://localhost:4000/todos');
        const todoResponse = response.data.data;
        let todoList = [];
        for(let key in todoResponse){
            todoResponse[key]._id=key;
            todoList.push(todoResponse[key]);
        }
        setTodos(!todoResponse?[]:todoList)
        setEditId("");
    }

    useEffect(()=>{
        getTodos();
    },[])

    return (
        <div className="todoContainer">
            <h1 className="todoContainerTitle">My Todo List</h1>    
            <SearchTodo isSearch={isSearch} setIsSearch = {setIsSearch} searchValue={searchValue} setSearchValue ={setSearchValue} />
            <div className="createTodoContainer">
                <input className="title" type="text" value={title} onChange={handleTitleEvent} placeholder="Title"/>
                <input className="description" type="text" value={description} onChange={handleDescriptionEvent} placeholder="Description"/>
                <button className = "createTodo"onClick={()=>{createTodo(title,description)}}>Create Todo</button>
            </div>
                <hr className="line"/>
            {isSearch?<ResponseTodos searchValue={searchValue} title={title} setTitle={setTitle} description={description} setDescription={setDescription} todos={todos} getTodos={getTodos} handleTitleEvent={handleTitleEvent} handleDescriptionEvent={handleDescriptionEvent} editId={editId} setEditId={setEditId} />:
            <AllTodos title={title} setTitle={setTitle} description={description} setDescription={setDescription} todos={todos} getTodos={getTodos} handleTitleEvent={handleTitleEvent} handleDescriptionEvent={handleDescriptionEvent} editId={editId} setEditId={setEditId} />
            }
        </div>
    )
}

export default Home