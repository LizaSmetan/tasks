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
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json())

router.get("/", (req, res) => {
  res.json({test: "true"});
  // try{
  //   const connection = mongoose.createConnection(`mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority`);
  //   const Tasks = connection.model('tasks', TasksSchema);
  //   Tasks.find().then(response => {
  //     res.json(response);
  //   }) 
  // } catch (e){
  //   res.json(e);
  // }
  
});
router.post("/", (req, res) => {
  const {body} = req;
  if(!body.text){
    res.status(404).send('Error');
  }
  try{
    const connection = mongoose.createConnection(`mongodb+srv://user:Ki11yourself@cluster0.vjq7std.mongodb.net/?retryWrites=true&w=majority`);
    const Tasks = connection.model('tasks', TasksSchema);
    Tasks.create({
      text: body.text,
      completed: !!body.completed
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
router.delete("/", (req, res) => {
  const {id} = req.query;
  
  if(!id){
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
// app.listen(8000, () => {
//   console.log(`Now listening on port 8000`); 
// });
module.exports = app;
module.exports.handler = serverless(app);
