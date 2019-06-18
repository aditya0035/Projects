const ConsumeMesaageFromQueue =require("./queueConsumer");
const nodemailer=require("nodemailer");
module.exports.StartSendEmailQueue=()=>{
        ConsumeMesaageFromQueue("EmailMessageQueue").then(msg=>{
        var transaporter= nodemailer.createTransport({
        service:"Gmail",
        auth:{
             user:"adityasaraswat0035@gmail.com",
             pass:"DEV@/24091991/"
        }
       });
       var mailOptions = {
        from: '"ChatApp 👻"<adityasaraswat0035@gmail.com>',
        to: msg.data.To, 
        subject: msg.data.Subject,
        html: msg.data.Body
        }
       transaporter.sendMail(mailOptions).then(()=>{
               console.log("message send");
               msg.messageAck();
        }).catch(err=>{
             console.log(err);
        });  
      
    });
};
