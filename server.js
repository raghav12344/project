var express=require("express");
var app=express();
var mysql=require("mysql2");
let config="mysql://avnadmin:AVNS_AdrypzLPwFLOySPl7dA@mysql-1e633ea7-raghav1233-61dd.k.aivencloud.com:28277/defaultdb?";
let db=mysql.createConnection(config);
let fileuploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;
let nodemailer=require("nodemailer");
var transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ludus.offiicial2024@gmail.com",
        pass:"bvdtqqdspaoyyvia"
    }
});
cloudinary.config({
    cloud_name: 'drsm7bvgf', 
    api_key: '441925695211367', 
    api_secret: '-jhKZ_AH-55LErkx_jPF1wT89ec'
});
app.use(fileuploader());
app.use(express.urlencoded(true));
db.connect(function(err){
    if(err==null)
        console.log("connected to database");
    else
        console.log(err.message);
})
app.use(express.static("public"));
app.listen(1000,function(req,resp){
    console.log("server started at 1000");
})
app.get("/",function(req,resp){
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})
app.get("/signup",function(req,resp){
    let email=req.query.txtEmail;
    let pwd=req.query.txtPwd;
    let utype=req.query.utype;

    db.query("insert into users(emailid,pwd,utype,status,dos) values(?,?,?,?,current_date())",[email,pwd,utype,1],function(err){
        if(err==null)
        {   resp.send("Signed up Successfully.Please Login To Continue");
            var mailoptions={
                from:"ludus.official2024@gmail.com",
                to:email,
                subject:"Welcome To The Community",
                text:"Thanks for registering on ludus.Hope you will make the environment healthy and good for players"
            }
            transporter.sendMail(mailoptions,function(error,info){
                if(error==null)
                {
                    resp.send("Please Login to continue");
                    console.log(info.response);
                }    
                else
                    console.log(error.message);
            })
        }
        else
            resp.send(err.message)
    })

})
app.get("/login",function(req,resp){
    let email=req.query.txtEmaillog;
    let pwd=req.query.txtPwdlog;
    db.query("select * from users where emailid=? and pwd=?",[email,pwd],function(err,jsonArray){
        // resp.send(jsonArray)
        console.log(jsonArray);
        if(jsonArray.length==1)
        {
            resp.send(jsonArray[0]["utype"]);
            console.log(jsonArray[0]["status"]);
        }
        else
            resp.send("incorrect credentials");
    })
    
})
app.get("/profileorganizer",function(req,resp){
    let path=__dirname+"/public/profileorganizer.html"
    resp.sendFile(path);
})
app.post("/savedetails",async function(req,resp){
    let email=req.body.txtemail;
    let mobile=req.body.txtmobile;
    let org=req.body.txtname;
    let address=req.body.txtadd;
    let city=req.body.txtcity;
    let zip=req.body.txtzip;
    let state=req.body.txtstate;
    let sports=req.body.sports;
    let proof=req.body.txtproof;
    let i=0;
    // console.log(sports);
    let strsports="";
    for(i=0;i<sports.length;i+=1)
    {
        strsports=strsports+","+sports[i];
    }
    let previous=req.body.txthosted;
    let web=req.body.txtweb;
    let insta=req.body.txtinsta;
    let filename="";
    console.log(req.body);
    filename=req.files.proofpic.name;
    let path=__dirname+"/public/uploads/"+filename;
    console.log(path);
    req.files.proofpic.mv(path);

    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
    });
    db.query("insert into organizers values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[email,org,mobile,address,city,state,zip,proof,filename,strsports,previous,web,insta],function(err){
        if(err==null)
            resp.send("saved successfully");
        else
            resp.send(err.message);
    })
})
app.get("/load-publish-tournaments",function(req,resp){
    let path=__dirname+"/public/publish-tournaments.html";
    resp.sendFile(path);
})
app.post("/post-tournament",async function(req,resp){
    let email=req.body.txtemail;
    let mobile=req.body.txtmobile;
    let game=req.body.txtgame;
    let title=req.body.txttitle;
    let fee=req.body.txtfee;
    let city=req.body.txtcity;
    let state=req.body.txtstate;
    let zip=req.body.txtzip;
    let add=req.body.txtaddress;
    let prizes=req.body.txtprizes;
    let dot=req.body.date_dot;
    let filename="";
    filename=req.files.picposter.name;
    // console.log(filename);
    let path=__dirname+"/public/uploads/"+filename;
    req.files.picposter.mv(path);
    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
    });
    let info=req.body.txtinfo;
    db.query("insert into tournaments values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[null,email,mobile,game,title,fee,dot,city,state,zip,add,prizes,filename,info],function(err){
        if(err==null)
            resp.send("posted successfully")
        else
            resp.send(err.message);
    })

})
app.get("/find-tournament",function(req,resp){
    let path=__dirname+"/public/tournaments-finder.html";
    resp.sendFile(path);
})
app.get("/fetch-cities", function(req,resp){
     db.query("select DISTINCT city from tournaments",function(err,jsonArray){
        if(err==null)
        {
            resp.send(jsonArray);
            // console.log(jsonArray);
        }
        else 
            resp.send(err.message);
    })

})
app.get("/fetch-sports", function(req,resp){
    db.query("select DISTINCT game from tournaments",function(err,jsonArray){
       if(err==null)
       {
           resp.send(jsonArray);
           // console.log(jsonArray);
       }
       else 
           resp.send(err.message);
   })

})
app.get("/search-tournaments",function(req,resp){
    let city=req.query.city;
    let game=req.query.game;

    db.query("select * from tournaments where  city=? and game=?",[city,game],function(err,jsonArray){
        if(err==null)
        {
            // console.log(jsonArray);
            resp.send(jsonArray);
        }
        else
        resp.send(err.message);
    })
})
app.get("/profileplayer",function(req,resp){
    let path=__dirname+"/public/profileplayer.html";
    resp.sendFile(path);
})
app.post("/savedetailsplayer",async function(req,resp){
    let email=req.body.txtemail;
    let mobile=req.body.txtmobile;
    let gender=req.body.txtgender;
    let fullname=req.body.txtfullname;
    let address=req.body.txtadd;
    let city=req.body.txtcity;
    let zip=req.body.txtzip;
    let state=req.body.txtstate;
    let games=req.body.txtgames;
    let previous=req.body.txtachv;
    let insta=req.body.txtinsta;
    let proof=req.body.txtproof;
    // console.log(proof);
    let filename="";
    console.log(req.body);
    filename=req.files.proofpic.name;
    let path=__dirname+"/public/uploads/"+filename;
    // console.log(path);
    req.files.proofpic.mv(path);
    await cloudinary.uploader.upload(path).then(function(result){
        filename=result.url;
        console.log(filename);
    });
    db.query("insert into players values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[email,fullname,gender,mobile,address,city,state,zip,proof,filename,games,previous,insta],function(err){
        if(err==null)
            resp.send("saved successfully");
        else
            resp.send(err.message);
    })
})
app.get("/searchplayers",function(req,resp){
    let email=req.query.txtemail;

    db.query("select * from players where emailid=?",[email],function(err){
        if(err==null)
            resp.send("user found");
        else
            resp.send(err.message);
    })
})
app.get("/change-settings",function(req,resp){
    let email=req.query.txtemail;
    let curr=req.query.txtcurr;
    let newpass=req.query.txtnew;

    db.query("update users set pwd=? where emailid=? and pwd=?",[newpass,email,curr],function(err,result){
        if (err!=null)
            resp.send(err.message);
        else if(result.affectedRows==1)
            resp.send("password successfully changed");
        else
            resp.send("invalid password");
    })
})