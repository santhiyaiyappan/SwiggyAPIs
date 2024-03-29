const bodyParser=require('body-parser')
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const {Restaurant,Users}=require('./schema.cjs')

const app=express()
app.use(bodyParser.json())
app.use(cors())
async function connectToDb(){
    try{
        await mongoose.connect('mongodb+srv://santhiya:Sandy601@cluster0.qskqwsn.mongodb.net/swiggyDB?retryWrites=true&w=majority')
        console.log('DB connection established;)')
        const port=process.env.PORT || 8000
        app.listen(port,function(){
            console.log(`Listening on port ${port}...`)   
        })
    }catch(error){
        console.log(error)
    console.log('Couldn\'t establish connection:(')
    }
}
connectToDb()
/**
 * /add-restaurant : post
 * /get-restaurant-details : get
 * /create-new-user : post
 * /validate-user : post
 */

app.post('/add-restaurant', async function(request, response) {
    try {
        await Restaurant.create({
            "areaName" : request.body.areaName,
            "avgRating" : request.body.avgRating,
            "costForTwo" : request.body.costForTwo,
            "cuisines" : request.body.cuisines,
            "name" : request.body.name
        })
        response.status(201).json({
            "status" : "success",
            "message" : "restaurant entry successful"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "restaurant entry unsuccessful",
            "error" : error
        })
    }
})

app.get('/get-restaurant-details',async function(request,response){
    try{
        const restaurantDetails=await Restaurant.find()
        response.status(200).json(restaurantDetails)
    }catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "couldn't fetch details",
            "error" : error
        })

    }
})
app.delete('/delete-restaurant-detail/:id', async function(request, response) {
    try {
        const restaurant = await Restaurant.findById(request.params.id)
        if(restaurant) {
            await Restaurant.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "deleted successfully"
            })
        } else { //restaurant : null
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete",
            "error" : error
        })
    }
}) 