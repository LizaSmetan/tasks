const express = require("express");
const serverless = require("serverless-http");
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const TasksSchema = new mongoose.Schema({
  text: { type: String },
  completed: {type: Boolean}
});
const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

router.get("/tasks", (req, res) => {
  try{
    const connection = mongoose.createConnection(`mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority`);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.find().then(response => {
      res.json(response);
    }) 
  } catch (e){
    res.json(e);
  }
  
});
router.use(bodyParser.json())
router.post("/tasks", (req, res) => {
  const {body} = req;
  if(!req.body.text){
    res.status(404).send('Error');
  }
  try{
    const connection = mongoose.createConnection(`mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority`);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.create({
      text: req.body.text,
      completed: !!req.body.completed
    }).then(() => {
      Tasks.find().limit(20).then(response => {
        connection.close()
        res.json(response);
      }).catch(e => {
        connection.close()
        res.status(404).send('Error');
      })
    }).catch(e => {
      connection.close()
      res.status(404).send('Error');
    })
  } catch (e){
    console.log(e)
    res.status(404).send('Error');
  }
  
});
router.post("/tasks/delete", (req, res) => {
  const {id} = req;
  if(!req.body.id){
    res.status(404).send('Error');
  }
  try{
    const connection = mongoose.createConnection(`mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority`);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.deleteOne({ _id: id }).then(() => {
      Tasks.find().limit(20).then(response => {
        connection.close()
        res.json(response);
      }).catch(e => {
        connection.close()
        res.status(404).send('Error');
      })
    }).catch(e => {
      connection.close()
      res.status(404).send('Error');
    })
  } catch (e){
    res.status(404).send('Error');
  }
  
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
