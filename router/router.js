const express = require('express');
const {getsignuppage , createuser , renderloginpage ,validateuser ,gethomepage ,authenticatToken ,clearcookie ,addtask,registertask,registertask2, getmytasks , deletetask ,getupdatetaskpage , postupdatedtask} = require('../controllers/controller');
const router =express.Router();


router.get ('/signup' , getsignuppage);
router.post('/signup' , createuser);
router.get('/login' , renderloginpage);
router.post('/login' , validateuser);
router.get('/home' ,  gethomepage);
router.get('/logout' , clearcookie);
router.get('/add-task', authenticatToken,addtask);
router.post('/add-task', authenticatToken,registertask);
router.post('/addtask' , registertask2);
router.get('/mytasks' , getmytasks );
router.post('/delete-task/:id' ,deletetask);
router.post('/updatetask/:id' , getupdatetaskpage);
router.post('/updatetask2/:id' , postupdatedtask );


module.exports = router;

