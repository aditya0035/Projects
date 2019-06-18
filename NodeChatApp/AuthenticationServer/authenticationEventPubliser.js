const ampqlib=require("amqplib");
const rabbitMqUrl=process.env.RabbitMqURL||"amqp://guest:guest@localhost:5672";
function PublishMessageToQueue(queuename,message){
return new Promise((resolve,reject)=>{ 
    ampqlib.connect(rabbitMqUrl)
    .then(connection=>{ return connection.createChannel()})
    .then(channel=>{
        channel.assertQueue(queuename).then(()=>{
            let send= channel.sendToQueue(queuename,Buffer.from(JSON.stringify(message)));
            if(send){
            resolve("Message Send");
            }else{
                reject("Something bad happened")
            }
        }).catch(err=>{
            reject(err);
        });
    }).catch(err=>{
        reject(err);
    });
});}

module.exports.SendEmailConfirmationMail=(consumerUrl,username,emaild,tempPasswordHash)=>{
        let url=consumerUrl+"/authenticate/confirmation/"+tempPasswordHash
        let mailTo=emaild
        let Subject="Congratulation for registration on Chat App";
        let MailBody=`Hi <strong>${username}</strong>
        Thanks for rgisteration on our application,Please confirm your email by clicking on provided url
        <a href="${url}">Click here</a>` 
        return PublishMessageToQueue("EmailMessageQueue",{Type:"EmailMessage",To:mailTo,Subject:Subject,Body:MailBody});
}
