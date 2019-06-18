const ampqlib=require("amqplib");
const rabbitMqUrl=process.env.RabbitMqURL||"amqp://guest:guest@localhost:5672";
function ConsumeMesaageFromQueue(queueName){
   return new Promise((resolve,reject)=>{ ampqlib.connect(rabbitMqUrl).then(connection=>{
         return connection.createChannel();
    }).then(channel=>{
         channel.assertQueue(queueName).then(()=>{
            channel.consume(queueName,(msg)=>{
                if(msg){
                    resolve({"data":JSON.parse(msg.content.toString("utf-8")),"messageAck":function(){channel.ack(msg)}});
                }
            })
        }).catch(ex=>{return reject("Something bad happened")});
    }).catch(ex=>{return reject("Something bad happened")});
});
}

module.exports=ConsumeMesaageFromQueue;
