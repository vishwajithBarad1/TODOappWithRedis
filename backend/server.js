require("dotenv").config()
const todoController = require("./controllers/todoController")
const express = require("express");
const client = require("./db/connectRedis");
const cors = require("cors")
const mongoose = require("./db/connectDb")
const app = express();

app.use(express.json());
app.use(cors())

app.get("/todos",todoController.getTodo);
app.post("/todos",todoController.createTodo);
app.put("/todos",todoController.updateTodo)
app.get("/getTodoById",todoController.getTodoById);

app.listen(process.env.PORT,()=>{console.log("your server is listining on port",process.env.PORT)})