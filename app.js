const express = require('express');
const cors = require('cors');
const app = express();  // Moved above app.use(cors());

app.use(cors());  // Enable CORS

app.use(express.json());

// Continue with your database connection and routes
const {connectToDb,getDb}=require('./db');

let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001,()=>{
            console.log("connected to database");
        })
        db=getDb();
    }
})



// //app.get request
app.get('/soilreport',(req,res)=>{
    const page = req.query.p ||0;
    const reportPerPage=10;
    let reports=[];

    db.collection('soilreport')
    .find()
    .sort({id:1})
    .skip(page*reportPerPage)
    .limit(reportPerPage)
    .forEach((report)=>reports.push(report))
    .then(()=>{
        res.status(200).json(reports);
    })
    .catch(()=>{
        res.status(500).json({msg:'error'});
    })
})


app.get('/soilreport/:id',(req,res)=>{
    const reportID = parseInt(req.params.id);
    if(!isNaN(reportID))
    {
        db.collection('soilreport')
        .findOne({id:reportID})
        .then((report)=>{
            if(report){
                res.status(200).json(report);
            }
            else{
                res.status(404).json({msg:'error student not found'});
            }
        })
        .catch(()=>{
            res.status(500).json({msg:'error in server'});
        })
    }
    else{
        res.status(400).json({msg:'id is not a number'});
    }
})


//post method
app.post('/soilreport',(req,res)=>{
    const report = req.body;
    db.collection('soilreport')
    .insertOne(report)
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch(()=>{
        res.status(500).json({msg:'error in something'});
    })
})


//update method
app.patch('/soilreport/:id',(req,res)=>{
    let update = req.body;
    const reportID = parseInt(req.params.id);
    if(!isNaN(reportID)){
        db.collection('soilreport')
        .updateOne({id:reportID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error'});
        })
    }
    else{
        res.status(400).json({msg:'not a number'});
    }
})


app.delete('/soilreport/:id',(req,res)=>{
    const reportID = parseInt(req.params.id);
    if(!isNaN(reportID)){
        db.collection('soilreport')
        .deleteOne({id:reportID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in the code'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})