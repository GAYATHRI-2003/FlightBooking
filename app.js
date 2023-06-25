const express = require("express")
const bodyParser = require("body-parser")
var mongoose = require("mongoose")
const ejs=require('ejs');
const app = express();
var fs = require('fs');
var path = require('path');
require('dotenv/config');

let alert = require('alert'); 
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile)
app.use(express.static('./views'));
app.set('views',"./views");
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
mongoose.connect('mongodb://localhost:27017/flight',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({ extended: false }))

var db = mongoose.connection;
db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.get("/",(req,res)=>{   
     res.redirect("home.html");
});


//signup
app.get("/sign_up",function(req,res){
    res.redirect("signup.html");
})

 var email;
 var name;
app.post("/sign_up",(req,res)=>{
     name = req.body.name;
     var phone= req.body.phone;
    email = req.body.email;
   
    var password = req.body.password;
    var conpassword=req.body.conpassword;
    var data = {
        "name": name,
        "phone":phone,
        "email" : email,
        "password" : password,
        "code":1
    
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        if(!isNaN(name))
        {
            alert("Name consists of only alphabets");
            
        }
        if(phone.length!=10)
        {
            alert("Phone Number consists of only 10 digits");
           

        }
        if(!email.includes('@'))
        {
            alert("Email address consists of @ symbol");
            

        }
        if(password.length!=6)
        {
            alert("Password contains only 6 digits only");
        }
        if(password!=conpassword){
            alert("Password and the conform password are wrong");
           

        }
        res.redirect('login.html');
       
    });

   

})
app.get("/" ,(req,res)=>{
    
    return res.redirect('home.html');
});


//login
const usersSchema={
    name:String,
    phone:String,
    email:String,
    password:String,
    code:Number
}
const User= mongoose.model('User',usersSchema);
app.get("/loginDetails", function (req, res) {
    res.redirect("login.html");
});
var email;
 var password;
app.post("/loginDetails", function(req, res) {
    email=req.body.email;
     password=req.body.password;
     checkpass(req,res,email,password)
})
app.get("/login",checkpass);
function checkpass(req,res,email,password){
    mongoose.model('User').findOne({email:email,password:password}).then(users=>{
       
		if(users!= null){
            mongoose.model('User').updateOne({email:email},{$set:{code:1}}).then(users=>{  
                console.log("Record Inserted Successfully");
}) 
            res.redirect('search.html');
            

        }
        else{
            res.redirect('login.html');
            alert("Enter valid email id or password");
        }
    });
};
//admin

//signup admin
app.get("/sign",function(req,res){
    res.redirect("signup1.html");
})

 var email;
 var name;
app.post("/sign",(req,res)=>{
     name = req.body.name;
     var phone= req.body.phone;
    email = req.body.email;
   
    var password = req.body.password;
    var conpassword=req.body.conpassword;
    var data = {
        "name": name,
        "phone":phone,
        "email" : email,
        "password" : password,
        "code":1
    
    }
    var c=0;
    db.collection('admins').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        if(!isNaN(name))
        {
            alert("Name consists of only alphabets");
            c=1;
            
        }
        if(phone.length!=10)
        {
            alert("Phone Number consists of only 10 digits");
            c=1;

        }
        if(!email.includes('@'))
        {
            alert("Email address consists of @ symbol");
            c=1;

        }
        if(password.length!=6)
        {
            alert("Password contains only 6 digits only");
            c=1;
        }
        if(password!=conpassword){
            alert("Password and the conform password are wrong");
            c=1;

        }
        if(c==0){
        alert("Admin added Successfully");
        res.redirect('adminfun.html');
        }
       
    });

   

})
app.get("/" ,(req,res)=>{
    
    return res.redirect('home.html');
});
//login admin
const adminsSchema={
    name:String,
    phone:String,
    email:String,
    password:String,
    code:Number
}
const Admin= mongoose.model('Admin',usersSchema);
app.get("/details", function (req, res) {
    res.redirect("login1.html");
});
var email;
 var password;
app.post("/details", function(req, res) {
    email=req.body.email;
     password=req.body.password;
     check(req,res,email,password)
})
app.get('/login1',check);
function check(req,res,email,password){
    mongoose.model('Admin').findOne({email:email,password:password}).then(admins=>{
        
		if(admins!= null){
            mongoose.model('Admin').updateOne({email:email},{$set:{code:1}}).then(users=>{  
                console.log("Record Inserted Successfully");
}) 
            res.redirect('adminfun.html');

        }
        else{
            res.redirect('login1.html');
            alert("Enter valid email id or password");
        }
        
    })
}
//add flight
app.get("/addflight",function(req,res){
    res.redirect("add.html");
})

 
 var name;
app.post("/addflight",(req,res)=>{
     name = req.body.name;
     var no = req.body.no;
     var sl= req.body.sl;
      var el = req.body.el;
       var price=req.body.price;
    var date = req.body.date;
    var time=req.body.time;
    var data = {
        "name": name,
        "no":no,
        "sl":sl,
        "el" : el,
        "price":price,
        "date" : date,
        "time":time,
        "seats":60
    
    }

    db.collection('availables').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        else{
            alert("Flight Added Successfully");
            res.redirect('adminfun.html')
        }
        
       
    });

   

})
app.get("/" ,(req,res)=>{
    
    return res.redirect('home.html');
});
//remove flight

var availablesSchema= new mongoose.Schema({
    name:String,
    no:String,
    sl:String,
    el:String,
    price:String,
    date:Date,
    time:String,
    seats:Number

})
const Available=mongoose.model('Available',availablesSchema);

var del;
app.post("/removeflight",(req,res)=>
{
    del=req.body.num;
    deleteflight(req,res,del)
})

app.get('/rembut',deleteflight);
function deleteflight(req,res,del)
{
    db.collection('availables').deleteMany({no:del},(err,availables)=>
    {
        if(err)
        {
            console.log(err);
        }
        else{
            alert("Flight Deleted Successfully");
            res.redirect('adminfun.html')
        }
    })
}
//profile
app.get('/',(req,res)=>{
    res.render('profile');
})

app.get("/profile",(req,res)=>{
    User.find({email:email,code:1}).then(users=>{
    
       res.render('profile',{
        usersList:users}
       
       )

    })
})
//search
var sl,el,date,time;
app.get("/findflight",function(req,res)
{
    res.redirect("search.html");
})
app.post("/findflight",function(req,res){
    sl=req.body.selectpicker;
    el=req.body.selectpicker1;
    date=req.body.date;
    time=req.body.selectpicker2; 
    

    finding(req,res,sl,el,date,time)
})      
app.get('/fl',finding);
function finding(req,res,sl,el,date,time){
    db.collection('users').findOne({email:email,code:1}).then(users=>{
        if(users!=null){
    Available.find({sl:sl,el:el,time:time}).then(flights=>{
        res.render('avail',{
            flightList:flights})
    })
}

    })
}
    
//logout
app.post('/log',(req,res) =>
{
    logopage(req,res);
})
app.get('/logout',logopage);
function logopage(req,res){
    mongoose.model('User').updateOne({email:email},{$set:{code:0}}).then(admins=>{
        console.log(email);
    })
    alert("LOG OUT SUCCESSFUL");
    res.redirect('home.html');
}
//seat
const bookedseatsSchema={
    flightno:String,
    flightname:String,
    booked:[String],
    useremail:String,
    

}
const Bookedseat=mongoose.model('Bookedseat',bookedseatsSchema);
app.get("/lo",function(req,res)
{
    res.redirect("avail");
})
var fn,fnu,fnam,fname1,tp,tp1;
app.post("/logo",function(req,res)
{
     fn=req.body.fno;
     fname1=req.body.fliname;
     tp1=req.body.tprice;
     fnu=fn;
     fnam=fname1;
     tp=tp1;
     console.log("hello");
    console.log("flight no");
    console.log(fn);
  
  
    console.log("flight name");
    console.log(fnam);
    console.log("ticket price");
    console.log(tp);
   // res.render("seat");
    Bookedseat.find({flightno:fnu}).then(bks =>{
        console.log(bks);
        res.render('seat',{
            seatsList:bks
        })
    }) 
    
   
    
})
var fn1,fname2,tp2;
app.post("/sea",function(req,res)
{
    fn1=req.body.fno;
    tp2=req.body.tprice;
    fnu=fn1;
    tp=tp2;
    console.log("flight no");
    console.log(fnu);
    fname2=req.body.fliname;
    fnam=fname2;
    console.log("flight name");
    console.log(fnam);
    console.log("ticket price");
    console.log(tp);
    
      //  res.render("seat");
        Bookedseat.find({flightno:fnu}).then(bks =>{
            console.log(bks);
            res.render('seat',{
                seatsList:bks
            })
        })
})
app.get("/se",function(req,res)
{
    
    //res.render("seat");
    Bookedseat.find({flightno:fnu}).then(bks =>{
        console.log(bks);
        res.render('seat',{
            seatsList:bks
        })
    })
})
var l;
var ide;
var flightno;
var booked;
var total;
app.post("/seating",function(req,res)
{
    ide=req.body.id;
    console.log(ide);
    l=ide.length;
    //flightno=fn;
    booked=ide;
var data={
    
    "flightno":fnu,
    "flightname":fnam,
    "booked":booked,
    "useremail":email,
}
Bookedseat.find({flightno:fnu}).then(bkss =>{
    console.log('welcome');
            for(var i=0;i<bkss.length;i++)
            {
                console.log(bkss[i].booked);
            }
            

//   return res.redirect('search.html');

})

        db.collection('bookedseats').insertOne(data,(err,collection) =>
     {
    if(err)
    {
        throw err;
    }

    return res.redirect("form.html");
    
   
})

//checking(req,res,fnu)
total=l*tp;
console.log("total price");
console.log(total);

})  
/*app.get('/c1',checking);
function checking(req,res,fnu)
{
    console.log(fnu);
    db.collection('bookedseats').find({flightno:fnu}).toArray((err,bkss) =>{
       
            
            console.log(bkss);

    return res.redirect('search.html');

    })

}*/
app.get('/seating',(req,res)=>{
    res.redirect("form.html");
})
//form
var detailsSchema ={
    username:String,
    userage:String,
    gender:String,
    mobile:String,
    noseatsbooked:Number,
    seatsbooked:[String],
    total_amount:String

}
const Detail=mongoose.model('Detail',detailsSchema);
app.post("/book_form",(req,res) =>{
    
        var username=req.body.name;
        var userage=req.body.age;
        var gender=req.body.gender;
        var mobile=req.body.phone;
        //var mail=req.body.email;
    
    var field={
        "username":username,
        "userage":userage,
        "gender":gender,
        "mobile":mobile,
        "mail":email,
        "noseatsbooked":l,
        "seatsbooked":booked,
        "total_amount":total
    }
    db.collection("details").insertOne(field,(err,collection) =>{
        if(err)
        {
            throw err;
        }
        else{
            console.log("user details added successfully");
            Detail.find({username:username,mobile:mobile,mail:email,seatsbooked:booked}).then(details =>{
                res.render('userdet',{
                    detailsList:details
                })
            })
            
            
        }
        
    })
    var data={
        "email":email,
        "flightno":fnu,
        "flightname":fnam,
        "sl":sl,
        "el":el,
        "date":date,
        "time":time,
        "sbooked":booked,
        "noseats":l,
        "amount":total
    }
    db.collection('mybookings').insertOne(data,(err,collection) =>
    {
        if(err)
        {
            throw err;
        }
        else{
            console.log("mybookings inserted successfully");
        }
    })
    
})
app.post("/dets",(req,res)=>
{
    res.redirect("thank.html");

})
//mybookings
var mybookingsSchema={
    email:String,
    flightno:String,
    flightname:String,
    sl:String,
    el:String,
    date:Date,
    time:String,
    sbooked:[String],
    noseats:Number,
    amount:Number


}
const Mybooking=mongoose.model('Mybooking',mybookingsSchema);
app.get('/bookings',(req,res) =>

{
    Mybooking.find({email:email}).then(bkngs => {
        res.render('bookings',{
            bookingsList:bkngs
        })
    })

})
//booked seats display
app.get('/seat',(req,res) =>{
    Bookedseat.find({flightno:fnu}).then(bks =>{
        console.log(bks);
        res.render('seat',{
            seatsList:bks
        })
    })

}
)
//admin profile
app.get('/',(req,res)=>{
    res.render('profile');
})

app.get("/prof",(req,res)=>{
    Admin.find({email:email,code:1}).then(users=>{
    
       res.render('profileadm',{
        adminsList:users}
       
       )

    })
})
//admin logout
app.post('/log',(req,res) =>
{
    logoutpage(req,res);
})
app.get('/logoutadmin',logoutpage);
function logoutpage(req,res){
    mongoose.model('Admin').updateOne({email:email},{$set:{code:0}}).then(users=>{
        console.log(email);
    })
    alert("LOG OUT SUCCESSFUL");
    res.redirect('home.html');
}
var port = process.env.PORT || 1240;
app.listen(port, function () {
    console.log("Server Has Started!");
});