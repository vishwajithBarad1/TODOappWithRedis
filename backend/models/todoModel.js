const { mongoose } = require("../db/connectDb");

const todoSchema = mongoose.Schema({
    title : {
        type:String
    },
    description :{
        type:String
    },
    completed:{
        type : Boolean,
        default:false
    }
})

const todoModel = mongoose.model("TODO",todoSchema)

module.exports={todoModel}