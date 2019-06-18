const restify=require("restify");
const restifyValidator=require("restify-validator");
const server=restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
const authenticationRouter=require("./router/authenticationRouter")(server)
server.listen(4000);