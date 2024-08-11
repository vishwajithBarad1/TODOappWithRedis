const { todoModel } = require("../models/todoModel")
const {client} = require("../db/connectRedis");
let DBflag = false

const handleCallback = (err, reply) => {
    if (err)    {
        console.log("this is error:",err)
        return
    }
    console.log("this is replay:",reply)
}


exports.getTodo = async (req,res) =>{
    try{
        let todos=[];
        if(!DBflag){
            //console.log("flag is false fetching todos from mongo DB");
            todos = await todoModel.find({completed:false})
            //filtering the useful data into temp
            let temp=todos.map((todo)=>{return [String(todo._id),({"title":todo.title,"description":todo.description})]})
            let todoValuePairs= {};
            let redisArgs = []
            for(let i=0;i<temp.length;i++){
                todoValuePairs[temp[i][0]] = temp[i][1];
                redisArgs.push(temp[i][0])
                redisArgs.push(JSON.stringify(temp[i][1]))
            }
            await client.del('todos');
            console.log("are these empty todos?",todos);
            if(todos.length!=0){
                await client.hSet("todos",redisArgs,(error,reply)=>handleCallback(error,reply));
            }
            //at this point i can do hGetAll and send data but i dont want to return stringified values insterd im sending the todoValuePairs with proper format
            todos = todoValuePairs;
            DBflag = true;
        }else{
            //console.log("flag is true fetching todos from redis DB");
            todos = await client.hGetAll("todos");
            for (let key in todos) {
                todos[key] = JSON.parse(todos[key]);
            }
        }
        res.status(200).json({
            success:true,
            data:todos
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.getTodoById = async (req,res)=>{
    try{
        const id = req.query.id;
        let todo=await client.hGet("todos",String(id));
        if(todo==null){
            todo = await todoModel.find({_id:id});
        }else{
            todo = JSON.parse(todo)
        }
        res.status(200).json({
            success:true,
            data: todo
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.createTodo = async (req,res) =>{
    try{
        const {title, description} = req.body
        const todo = await todoModel({
            title,
            description
        })
        await todo.save()
        await client.hSet("todos", String(todo._id),JSON.stringify({title,description}), (err, reply) => handleCallback(err, reply))
        res.status(201).json({
            success:true,
            message:"created todo successfully",
            data:todo,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateTodo = async (req,res)=>{
    try{
        const {id}=req.query;
        const {task,title,description} = req.body;
        if(task === "complete" ){
            await todoModel.updateOne({_id:id},{completed:true})
            res.status(200).json({
                success:true,
                message:"todo marked completed successfully"
            })
        }else{
            await todoModel.updateOne({_id:id},{title,description});
            res.status(200).json({
                success:true,
                message:"todo updated successfully"
            })
        }
        DBflag = false;
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}