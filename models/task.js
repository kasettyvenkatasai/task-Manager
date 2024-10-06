const mongoose = require('mongoose');
const taskSchema  = mongoose.Schema({
     title:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true
     },
     
     priority: {
         type: String, 
         enum: ['low', 'medium', 'high'], 
         default: 'low' },
      duedate:{
         type:Date,
         required:true
      }
});
const Task = mongoose.model('task' , taskSchema);
module.exports = Task;