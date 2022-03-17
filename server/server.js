const express = require('express')
const app = express()
const { default: mongoose } = require('mongoose')
const tasks = require('./models/task')
const cors = require('cors')
const bodyParser = require('body-parser')
const { logDOM } = require('@testing-library/react')

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))


app.get('/allItems', async (req,res) => {
    try
    {
        const allItems = await tasks.find({})

        res.header(200).json(allItems)
    }
    catch(e)
    {
        console.log(e);
    }

})

app.post('/saveItem',async(req,res) => {
    try
    {
        const createdTask = await tasks.create(
            req.body
        )

        const savedTask = await createdTask.save()
        res.json(savedTask)
    }catch(e)
    {
        console.log(e);
    }
})

app.post('/updateItem/:id',async (req,res) => {
    console.log(req.params);
    try{
        const updatedItem = await tasks.findByIdAndUpdate(req.params.id.trim()
        ,{completed:true})
        res.json(updatedItem)
    }
    catch(e)
    {
        console.log(e);
    }
})


app.delete('/deleteItem/:id',async(req,res) =>{

    // console.log(req.params);
    const {id} = req.params

    try
    {
        const deletedTask = await tasks.findByIdAndDelete(id.trim())
        // const deletedTask = await tasks.deleteOne(_id)
        res.json(deletedTask)
    }
    catch(e)
    {
        console.log(e);
    }
})

app.delete('/deleteCompletedItems',async(req,res) =>{

    // console.log(req.body);
    try
    {
        const deletedTask = await tasks.deleteMany(req.body)
        res.json(deletedTask)
    }
    catch(e)
    {
        console.log(e);
    }
})


const connectDb = async () =>{
    const connect = await mongoose.connect('mongodb+srv://restful:rest123@firstsproject.fufha.mongodb.net/TodoListEnhanced?retryWrites=true&w=majority' , () => {
        console.log('connected to the database')
        app.listen(5000, () => {
            console.log(`server is listening on port 5000`);
        })
    })
}

connectDb()