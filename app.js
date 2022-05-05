const express = require('express');
const req = require('express/lib/request');
const app = express();
const mysql = require("./connection").con
const bodyParser = require('body-parser');
const fast2sms = require('fast-two-sms');
var session = require('express-session')

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set("view engine","hbs")
app.set("views",(__dirname,"./public"))

app.use(session({
    secret: 'dolUKB3yEh',
    resave: false,
    saveUninitialized: true
  }))

//Create Server
app.listen(3000)

app.use(express.static("static"))


app.get('/',(req,res) =>{
    res.render('home');
});

app.get('/ProctorSignup',(req,res)=>{
    res.render('signup');
})



app.post('/psignsubmit',(req,res)=>{

    const {procname,procmail,procid,procpass} = req.body

    let qry4 = "select * from proctor where proct_id=?";
    mysql.query(qry4,[procid],(err,results)=>{
        if(err)
            throw(err)
        else{
                if(results.length>0){
                res.render('login')
                }
                else{
                    let qry5 = "INSERT INTO `proctor`(proct_id,proct_name,pmail,proct_pass) VALUES (?,?,?,?);"
                    mysql.query(qry5,[procid,procname,procmail,procpass],(err,results)=>{
                        if(err)
                            throw(err)
                        else{
                            if(results.affectedRows>0){
                                res.render("signup",{signmesg:true})
                                let qry13 = "INSERT INTO `student`(fname,lname,usn,bdate,branch,sem,sec,mob,regdate,email,address,adm,rak,bloodgrp,gender,hostel,proct_id,sb,si,spass,sclass,sperc) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
                                mysql.query(qry13,['test','test',procid,'2022-01-01','ISE','5','B','9999012345','2022-01-01','test@gmail.com','test','CET','10101','B+','Male','No',procid,'ad','cb','jz','gh','mn'],(err,results)=>{//to create student on signup just for dashboard
                                    if(err)
                                        throw(err)
                                    else{
                                        console.log(results.affectedRows)////////
                                    }
                                })
                            }
                        }

                 })
                }
            } 
        })  
});


app.get('/Proctorlogin',(req,res)=>{
    res.render('login');
});

app.post('/ploggedin',(req,res)=>{
    
   var procid = req.body.procid;
   var procpass = req.body.procpass;
   
   let qry6 = "select * from proctor where proct_id=? and proct_pass=?";
   mysql.query(qry6,[procid,procpass],(err,results)=>{
       procn = results
       if(err)
          throw(err)
        else{                
                if(procn.length>0){
                    req.session.user=req.body.procid;
                    req.session.pass=req.body.procpass;
                    res.redirect('/dashboard')
                }
                else{
                    res.render("login",{logfail:true})
                }
            }  

   })

});

app.get('/dashboard',(req,res)=>{
    var procid = req.session.user;
    var procpass = req.session.pass;
    if(req.session.user){
        let qry7 = "SELECT S.* ,P.* FROM student S,proctor P WHERE S.proct_id=P.proct_id AND S.proct_id=?";
                    mysql.query(qry7,[procid],(err,results)=>{ 
                        data1=results                   
                         if(err)
                           throw(err)
                        else{
                               if(procn.length>0){
                                res.render("dashboard",{data1:results, d1:procn[0].proct_name,proid:procid,procpass})
                               }
                               else{
                                console.log(results)
                               }
                            }
                 
                    })
    }
    else{
        res.send("Unauthorized user")
    }
})

app.get('/logout',(req,res)=>{
    
    req.session.destroy(function(err){
        if(err) throw err;
        else{
            res.render('login',{logout:true});
        }

    })
})

app.get('/StudentForm',(req,res) =>{


    let qry2 = "select proct_id,proct_name from proctor";

    mysql.query(qry2,(err,results) =>{
        if(err)
          throw(err)
        else{
             if(results.length>0){
                 res.render("StudentForm",{data: results})
             }
        }
    }) 
});


app.post('/closethistab',(req,res) =>{
       
  //assigning for body elements to variables 
  const {first_name,last_name,usn,dob,branch,semester,section,contact_no,registeration_date,emailid,address,Admitted_on,rank,bloodgroup,gender,hosteler,proctorid,sboard,sinstitution,spassing_year,sClass_obtained,sPercentage,pboard,pinstitution,ppassing_year,pClass_obtained,pPercentage,dboard,dinstitution,dpassing_year,dClass_obtained,dPercentage,hobbies,eca,achievements,father_name,father_occupation,Father_Address,father_contact_no,father_emailid,Mother_name,Mother_occupation,Mother_Address,Mother_contact_no,Mother_emailid,Guardian_name,Guardian_occupation,Guardian_Address,Guardian_contact_no,Guardian_emailid} = req.body

  let qry1 = "select * from student where usn=?";
  mysql.query(qry1,[usn],(err,results)=>{
    if(err)
        throw(err)
    else{
        if(results.length>0)
            {
                res.render("StudentForm",{checkmesg:true})
            }
        else{
            //insert query
            let qry3 = "INSERT INTO `student`(fname,lname,usn,bdate,branch,sem,sec,mob,regdate,email,address,adm,rak,bloodgrp,gender,hostel,proct_id,sb,si,spass,sclass,sperc,pb,pins,ppass,pclass,pperc,db,di,dpass,dclass,dperc,hobby,ec,achieve,fn,fo,fa,fc,fmail,mn,mo,ma,mc,me,gn,go,ga,gc,ge) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

            mysql.query(qry3,[first_name,last_name,usn,dob,branch,semester,section,contact_no,registeration_date,emailid,address,Admitted_on,rank,bloodgroup,gender,hosteler,proctorid,sboard,sinstitution,spassing_year,sClass_obtained,sPercentage,pboard,pinstitution,ppassing_year,pClass_obtained,pPercentage,dboard,dinstitution,dpassing_year,dClass_obtained,dPercentage,hobbies,eca,achievements,father_name,father_occupation,Father_Address,father_contact_no,father_emailid,Mother_name,Mother_occupation,Mother_Address,Mother_contact_no,Mother_emailid,Guardian_name,Guardian_occupation,Guardian_Address,Guardian_contact_no,Guardian_emailid],(err , results)=>{
                if(err)
                    throw(err)
                else
                {
                    if(results.affectedRows>0){
                        res.render("StudentForm",{mesg:true})
                    }
                }
                
               })
            }
    }
        
    

  })


});

app.get('/details',(req,res)=>{
    var usn = req.query.usn;

    let qry8 = "SELECT S.* ,P.* FROM student S,proctor P WHERE S.proct_id=P.proct_id AND S.usn=?";
    mysql.query(qry8,[usn],(err,results)=>{
        if(err)
            throw(err)
        else{
            if(results.length>0)
                {
                    res.render("showdetails",{data3:results})
                }

            }
    })
});

app.get('/meeting',(req,res)=>{
    var proid = req.query.proid;
    procpass=req.query.procpass;
    if(req.session.user){
    let qry11 = "select * from meeting where proc_id=?"
    mysql.query(qry11,[proid],(err,results)=>{
        if(err)
            throw(err)
        else{
                 res.render('meeting',{proid:proid,data5:results,procpass})
            }
        }) 
    }         
});
    

app.post('/meetingsub',(req,res)=>{
    const proid = req.query.pro
    const {No,desc} = req.body
    let qry9 = "select * from meeting where meeting_no=? and proc_id=?";
    mysql.query(qry9,[No,proid],(err,results)=>{
      if(err)
          throw(err)
      else{
          if(results.length>0)
              {
                res.render("meeting",{checkmesg:true,procpass,proid})
              }
            else{
               let qry10 ="call insertmeeting(?,?,?)"
                mysql.query(qry10,[No,desc,proid],(err,results)=>{
                    if(err)
                        throw(err)
                    else
                    {
                        if(results.affectedRows>0){
                            res.render('meeting',{mesg:true})
                        }
                    }     

                    })
                            
                }
            }

    })

});

app.get('/meetingdetails',(req,res)=>{
    var proct_id = req.query.procid;
    var meet_no = req.query.meetno;

    let qry12 = "select * from meeting where proc_id=? and meeting_no=?"
    mysql.query(qry12,[proct_id,meet_no],(err,results)=>{
        if(err)
            throw(err)
        else{
            res.render('meetingdetails',{md:results})
        }

    })

});

app.get('/deletemd',(req,res)=>{
    procid = req.query.procid;
    meetno = req.query.meetno;

    let qry14 = "DELETE FROM `miniproject`.`meeting` WHERE (`meeting_no` = ? and `proc_id` = ?);"
    mysql.query(qry14,[meetno,procid],(err,results)=>{
        if(err)
            throw(err)
        else{
            if(results.affectedRows>0){
                let qry23 = "select proct_pass,proct_id from proctor where proct_id=?"
                     mysql.query(qry23,[procid],(err,results)=>{
                        if(err)
                            throw(err)
                         else{
                                res.render('deleted',{data:results})
        }
    })
            }
        }
    })

});

//add student in dashboard
app.get('/addst',(req,res)=>{
    let qry9 = "select proct_id,proct_name from proctor";

    mysql.query(qry9,(err,results) =>{
        if(err)
          throw(err)
        else{
             if(results.length>0){
                 res.render("addst",{data: results}) //closethistab ref
             }
        }
    }) 
});



//test and attendance
app.get('/ta',(req,res)=>{
    pro= req.query.proid;
    procpass=req.query.procpass;
    res.render('tahome',{pro,procpass})
});

app.get('/shortage',(req,res)=>{
    let qry15="select * from attendance_shortage where proctor_id=?"
    mysql.query(qry15,[pro],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.length>0){
                res.render('shortage',{data:results})
            }
        } 
    })

})

app.post('/search',(req,res)=>{ //directly we can use proid sent through above get request
    usn=req.body.usn;

    let qry15="select * from student where proct_id=? and usn=?"
    mysql.query(qry15,[pro,usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.length>0){
                res.render('tahome',{mesg:true,usn:req.body.usn,procpass,pro})
            }
            else{
                res.render('tahome',{checkmesg:true,procpass,pro})
            }
       }
    })

});

//test1
app.get('/test1',(req,res)=>{
    usn=req.query.usn;
    res.render('ta1',{usn:usn})
});

app.post('/test1submit',(req,res)=>{
//assigning for body elements to variables 
    const {sub1t1,sub1a1,sub2t1,sub2a1,sub3t1,sub3a1,sub4t1,sub4a1,sub5t1,sub5a1,sub6t1,sub6a1,sub7t1,sub7a1,sub8t1,sub8a1,sub9t1,sub9a1}=req.body;
    let qry16 = "select * from test1 where usn=?";
    mysql.query(qry16,[usn],(err,results)=>{
      if(err)
          throw(err)
      else{
          if(results.length>0)
              {
                  res.render("ta1",{checkmesg:true})
              }
          else{
                //insert query
                let qry17 = "INSERT INTO `test1`(usn,s1t1,s1a1,s2t1,s2a1,s3t1,s3a1,s4t1,s4a1,s5t1,s5a1,s6t1,s6a1,s7t1,s7a1,s8t1,s8a1,s9t1,s9a1) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

                mysql.query(qry17,[usn,sub1t1,sub1a1,sub2t1,sub2a1,sub3t1,sub3a1,sub4t1,sub4a1,sub5t1,sub5a1,sub6t1,sub6a1,sub7t1,sub7a1,sub8t1,sub8a1,sub9t1,sub9a1],(err , results)=>{
                    if(err)
                        throw(err)
                    else
                    {
                        if(results.affectedRows>0){
                            res.render("ta1",{mesg:true})
                        }
                    }
                    
                })
            }
        }
})
});

//test2
app.get('/test2',(req,res)=>{
    usn=req.query.usn;
    res.render('ta2',{usn:usn})
});

app.post('/test2submit',(req,res)=>{
//assigning for body elements to variables 
    const {sub1t2,sub1a2,sub2t2,sub2a2,sub3t2,sub3a2,sub4t2,sub4a2,sub5t2,sub5a2,sub6t2,sub6a2,sub7t2,sub7a2,sub8t2,sub8a2,sub9t2,sub9a2}=req.body;
    let qry16 = "select * from test2 where usn=?";
    mysql.query(qry16,[usn],(err,results)=>{
      if(err)
          throw(err)
      else{
          if(results.length>0)
              {
                  res.render("ta2",{checkmesg:true})
              }
          else{
                //insert query
                let qry17 = "INSERT INTO `test2`(usn,s1t2,s1a2,s2t2,s2a2,s3t2,s3a2,s4t2,s4a2,s5t2,s5a2,s6t2,s6a2,s7t2,s7a2,s8t2,s8a2,s9t2,s9a2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

                mysql.query(qry17,[usn,sub1t2,sub1a2,sub2t2,sub2a2,sub3t2,sub3a2,sub4t2,sub4a2,sub5t2,sub5a2,sub6t2,sub6a2,sub7t2,sub7a2,sub8t2,sub8a2,sub9t2,sub9a2],(err , results)=>{
                    if(err)
                        throw(err)
                    else
                    {
                        if(results.affectedRows>0){
                            res.render("ta2",{mesg:true})
                        }
                    }
                    
                })
            }
        }
})
});

//test3
app.get('/test3',(req,res)=>{
    usn=req.query.usn;
    res.render('ta3',{usn:usn})
});

app.post('/test3submit',(req,res)=>{
//assigning for body elements to variables 
    const {sub1t3,sub1a3,sub2t3,sub2a3,sub3t3,sub3a3,sub4t3,sub4a3,sub5t3,sub5a3,sub6t3,sub6a3,sub7t3,sub7a3,sub8t3,sub8a3,sub9t3,sub9a3}=req.body;
    let qry16 = "select * from test3 where usn=?";
    mysql.query(qry16,[usn],(err,results)=>{
      if(err)
          throw(err)
      else{
          if(results.length>0)
              {
                  res.render("ta3",{checkmesg:true})
              }
          else{
                //insert query
                let qry17 = "INSERT INTO `test3`(usn,s1t3,s1a3,s2t3,s2a3,s3t3,s3a3,s4t3,s4a3,s5t3,s5a3,s6t3,s6a3,s7t3,s7a3,s8t3,s8a3,s9t3,s9a3) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

                mysql.query(qry17,[usn,sub1t3,sub1a3,sub2t3,sub2a3,sub3t3,sub3a3,sub4t3,sub4a3,sub5t3,sub5a3,sub6t3,sub6a3,sub7t3,sub7a3,sub8t3,sub8a3,sub9t3,sub9a3],(err , results)=>{
                    if(err)
                        throw(err)
                    else
                    {
                        if(results.affectedRows>0){
                            res.render("ta3",{mesg:true})
                        }
                    }
                    
                })
            }
        }
})
});

//Final IA
app.get('/finalia',(req,res)=>{
    usn=req.query.usn;
    res.render('finalia',{usn:usn})
});

app.post('/finaliasubmit',(req,res)=>{
//assigning for body elements to variables 
    const {sub1tf,sub1af,sub1see,sub1tot,sub1pf,sub2tf,sub2af,sub2see,sub2tot,sub2pf,sub3tf,sub3af,sub3see,sub3tot,sub3pf,sub4tf,sub4af,sub4see,sub4tot,sub4pf,sub5tf,sub5af,sub5see,sub5tot,sub5pf,sub6tf,sub6af,sub6see,sub6tot,sub6pf,sub7tf,sub7af,sub7see,sub7tot,sub7pf,sub8tf,sub8af,sub8see,sub8tot,sub8pf,sub9tf,sub9af,sub9see,sub9tot,sub9pf,TOTALMARKS,PERCENTAGE,SGPA,CGPA,OP,NB}=req.body;
    let qry16 = "select * from finalia where usn=?";
    mysql.query(qry16,[usn],(err,results)=>{
      if(err)
          throw(err)
      else{
          if(results.length>0)
              {
                  res.render("finalia",{checkmesg:true})
              }
          else{
                //insert query
                let qry17 = "INSERT INTO `finalia`(usn,s1t4,s1a4,s1see,s1tm,s1stat,s2t4,s2a4,s2see,s2tm,s2stat,s3t4,s3a4,s3see,s3tm,s3stat,s4t4,s4a4,s4see,s4tm,s4stat,s5t4,s5a4,s5see,s5tm,s5stat,s6t4,s6a4,s6see,s6tm,s6stat,s7t4,s7a4,s7see,s7tm,s7stat,s8t4,s8a4,s8see,s8tm,s8stat,s9t4,s9a4,s9see,s9tm,s9stat,totalmarks,sgpa,cgpa,percentage,performance,backlogs,proctorid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"

                mysql.query(qry17,[usn,sub1tf,sub1af,sub1see,sub1tot,sub1pf,sub2tf,sub2af,sub2see,sub2tot,sub2pf,sub3tf,sub3af,sub3see,sub3tot,sub3pf,sub4tf,sub4af,sub4see,sub4tot,sub4pf,sub5tf,sub5af,sub5see,sub5tot,sub5pf,sub6tf,sub6af,sub6see,sub6tot,sub6pf,sub7tf,sub7af,sub7see,sub7tot,sub7pf,sub8tf,sub8af,sub8see,sub8tot,sub8pf,sub9tf,sub9af,sub9see,sub9tot,sub9pf,TOTALMARKS,SGPA,CGPA,PERCENTAGE,OP,NB,pro],(err , results)=>{
                    if(err)
                        throw(err)
                    else
                    {
                        if(results.affectedRows>0){
                            res.render("finalia",{mesg:true})
                        }
                    }
                    
                })
            }
        }
})
});

//show attendance and marks details 
app.get('/showtd',(req,res)=>{
    usn=req.query.usn;

    let qry18="SELECT * FROM test1 WHERE usn=?"
    mysql.query(qry18,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            datax=results
            let qry19="SELECT * FROM test2 WHERE usn=?"
            mysql.query(qry19,[usn],(err,results)=>{
                if(err) throw(err)
                else{
                    datay=results
                    let qry20="SELECT * FROM test3 WHERE usn=?"
                    mysql.query(qry20,[usn],(err,results)=>{
                        if(err) throw(err)
                        else{
                            dataz=results
                            let qry21="SELECT * FROM finalia WHERE usn=?"
                            mysql.query(qry21,[usn],(err,results)=>{
                                if(err) throw(err)
                                else{
                                    datab=results
                                    res.render('showta',{data1:datax,data2:datay,data3:dataz,data4:datab,usn:usn})
                            
                                    }
        
                             })

                        }
        
                    })
                }

            })
       }
    })



});

//Delete Stuent details

app.get('/del',(req,res)=>{
    pro= req.query.proid;
    procpass=req.query.procpass;
    res.render('delhome',{pro,procpass})
});

app.post('/searchdel',(req,res)=>{ //directly we can use proid sent through above get request
    usn=req.body.usn;

    let qry15="select * from student where proct_id=? and usn=?"
    mysql.query(qry15,[pro,usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.length>0){
                res.render('delhome',{mesg:true,usn:req.body.usn,pro,procpass})
            }
            else{
                res.render('delhome',{checkmesg:true,pro,procpass})
            }
       }
    })

});


app.get('/deldsfd',(req,res)=>{
    usn=req.query.usn;
    let qry22="delete from student where usn=?"
    mysql.query(qry22,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.affectedRows>0){
                res.render('delhome',{dsfd:true,pro,procpass})
            }
            else{
                res.render('delhome',{notdsfd:true,pro,procpass})
            }
       }
    })
   
});


app.get('/deltest1',(req,res)=>{
    usn=req.query.usn;
    let qry22="delete from test1 where usn=?"
    mysql.query(qry22,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.affectedRows>0){
                res.render('delhome',{test1:true,pro,procpass})
            }
            else{
                res.render('delhome',{nottest1:true,pro,procpass})
            }
       }
    })
    
});
app.get('/deltest2',(req,res)=>{
    usn=req.query.usn;
    let qry22="delete from test2 where usn=?"
    mysql.query(qry22,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.affectedRows>0){
                res.render('delhome',{test2:true,pro,procpass})
            }
            else{
                res.render('delhome',{nottest2:true,pro,procpass})
            }
       }
    })
});
app.get('/deltest3',(req,res)=>{
    usn=req.query.usn;
    let qry22="delete from test3 where usn=?"
    mysql.query(qry22,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.affectedRows>0){
                res.render('delhome',{test3:true,pro,procpass})
            }
            else{
                res.render('delhome',{nottest3:true,pro,procpass})
            }
       }
    })
});
app.get('/delfinalia',(req,res)=>{
    usn=req.query.usn;
    let qry22="delete from finalia where usn=?"
    mysql.query(qry22,[usn],(err,results)=>{
       if(err) throw(err)
       else{
            if(results.affectedRows>0){
                res.render('delhome',{finalia:true,pro,procpass})
            }
            else{
                res.render('delhome',{notfinalia:true,pro,procpass})
            }
       }
    })
});

app.get('/msg',(req,res)=>{
    res.render('message')
});


app.post('/SendMessage',(req,res)=>{
    var options ={authorization : process.env.API_KEY , message : req.body.subject ,  numbers : [req.body.ph]}
    fast2sms.sendMessage(options).then(response=>{
        console.log(response)
        res.render('message',{mesg:true})
      })
})

app.get('/parentmsg',(req,res)=>{
    parentcontact=req.query.contact;
    res.render('parentmsg',{parentcontact})
})


app.use((req,res)=>{
    res.status(404).render('404');
});

