import AllTodos from "./AllTodos";
function ResponseTodos({searchValue,title, setTitle, description, setDescription, todos,getTodos,editId,setEditId,handleTitleEvent,handleDescriptionEvent}){
    let resTodos = []
    console.log("this is todos:",todos);
    for(let i=0;i<todos.length;i++){
        if(todos[i]["title"].includes(searchValue) || todos[i]["description"].includes(searchValue)){
            resTodos.push(todos[i])
        }
    }
    return(
        <div>
            <AllTodos title={title} setTitle={setTitle} description={description} setDescription={setDescription} todos={resTodos} getTodos={getTodos} handleTitleEvent={handleTitleEvent} handleDescriptionEvent={handleDescriptionEvent} editId={editId} setEditId={setEditId}  />
        </div>
    )
}

export default ResponseTodos