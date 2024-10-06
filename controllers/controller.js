const express = require('express');
const user = require('../models/user');
const Task = require('../models/task');
const jwt = require('jsonwebtoken');
const secret  = 'venkat';

async function clearcookie(req,res) {
    const token = req.cookies.authToken;
    if(token){
        res.clearCookie('authToken' , {httpOnly:true});
    }
    return res.redirect('/login');
}
async function getsignuppage(req,res) {
    res.render('signup' , {message : null});
}
async function createuser(req,res) {
    try {
         const {username ,email,password,confirmPassword} = req.body;
         if (password !=  confirmPassword) {
            return res.render( 'signup' , {message : "passwords does not match"});
         }
         const existinguser = await user.findOne({email : email});
         if(existinguser){
            return res.render( 'signup' , {message : "email already exists use another emaail"});
         }
        await user.create({
            username : username,
            email :email,
            password:password
         })
        
         res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
}
async function validateuser(req,res) {
     try {
         
        const {email,password} = req.body;

        const isuser = await user.findOne({
            email:email
        })
         if (!isuser) {
            return res.render('login' , {message:"user with this email doesnt exist"});
         }
        
        if (password != isuser.password) {
            return res.render('login' , {message:"you have entered a wrong password"});
        }
        const token = jwt.sign(
            {name: isuser.username ,email: isuser.email},
            secret,{expiresIn : '1h' }
        )
        res.cookie('authToken', token, { httpOnly: true, secure: false }); 
        res.redirect('/home');
     } catch (error) {
        console.log(error);
     }
}


function authenticatToken(req,res,next){
      const token = req.cookies.authToken;
      if(!token){
        res.render('login' , {message : "unauthorized please login"});

      }
      jwt.verify(token , secret , (err,user)=>{
        if (err) {
            res.render('login'  , {message: "token expired please login again"});
        }

        req.user = user;
        next()
      })
}
async function renderloginpage(req,res) {
    res.render('login' ,{message:null})
}
async function gethomepage(req, res) {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.render('login', { message: 'Session expired, please log in again.' });
        }
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.render('login', { message: 'Session expired, please log in again.' });
            }

            const tasks  = await Task.find({email : decoded.email});
            res.render('home' , { user : decoded , tasks:tasks});
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function addtask(req, res) {
    res.render('add-task', { user: req.user , message : null }); 
}
async function registertask(req,res) {
     res.render('add-task' ,{ user :  req.user , message:"register a new task"})
}
async function registertask2(req, res) {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.render('login', { message: 'Session expired, please login again.' });
        }

      
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decodedUser) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decodedUser);
                }
            });
        });

     
        const { title, description, priority,duedate } = req.body;
        const dueDateObject = new Date(duedate);
        await Task.create({
            title: title,
            email: user.email,
            description: description,
            priority: priority,
            duedate:dueDateObject
        });

        
        res.redirect('/mytasks');
    } catch (error) {
     
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.render('login', { message: 'Token expired, please login again.' });
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}
async function getmytasks(req, res) {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.render('login', { message: 'Session expired, please log in again.' });
        }
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.render('login', { message: 'Session expired, please log in again.' });
            }

            const tasks = await Task.find({ email: decoded.email });

            res.render('mytasks', { tasks });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
async function deletetask(req,res) {
    try {
         const token = req.cookies.authToken;
         jwt.verify(token,secret,async(err,decoded)=>{
            if (err) {
                res.render('login' , "session expired please login again");
            }
            const task_id = req.params.id;
           
            await Task.findByIdAndDelete(task_id);
            const tasks = await Task.find({ email: decoded.email });
            res.render('mytasks' , {tasks});

         })

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function getupdatetaskpage(req,res) {
    const token = req.cookies.authToken;
    
    jwt.verify(token,secret,async(err,decoded)=>{
        if (err) {
                res.render('login' , {message:"session expired please login again"});
        }
        const taskid = req.params.id;
        const findtask = await Task.findById(taskid);

        if (!findtask) {
            return res.status(404).render('error', { message: "Task not found" });
        }

        res.render('update-task', { task: findtask });
    })
}
async function postupdatedtask(req,res) {
    try {
        const token = req.cookies.authToken;
        jwt.verify(token,secret,async(err,decoded)=>{
            if (err) {
                return res.render('login' , {message:"session expired please login again"});
            }
            const {title, description, priority,duedate } = req.body;
            const taskid = req.params.id;
            
            const updatetask = await Task.findByIdAndUpdate(taskid,{title: title , description :description , priority:priority,duedate:duedate}, {new:true});
            const task = await Task.find({email : decoded.email});
              if (!updatetask) {
                res.send("couldnot find the task");
              }
              res.render('mytasks' , {tasks:task });

        })
        
    } catch (error) {
        console.log(error);
    }
}


module.exports = {getsignuppage , createuser ,renderloginpage  ,validateuser ,gethomepage ,authenticatToken ,clearcookie ,addtask,registertask ,registertask2 ,getmytasks ,deletetask ,getupdatetaskpage,postupdatedtask};