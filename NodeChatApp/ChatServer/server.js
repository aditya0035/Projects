const http=require("http");
const express=require("express");
const socket=require("socket.io");
const chatApp=express();
const server=http.createServer(chatApp);
const io=socket(server);

