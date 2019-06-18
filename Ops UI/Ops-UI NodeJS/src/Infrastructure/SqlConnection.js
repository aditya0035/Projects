var sql=require("mssql");
const Keys={
    dataSource:["data source","server"],
    initialCatalog:["initial catalog","database"],
    username:["user id","username"],
    password:["password"],
    provider:["provide"]
}
const Pool={
    min:1,
    max:1,
    connections:[]
}
const Config={}
function SqlConnection(ConnectionString,Provider="SQL_SERVER"){
    this.connectionString=ConnectionString||process.env.ConnectionString;
    this.SetUp()
    this.provider=Provider;
    this.Connection=null;
}
SqlConnection.prototype.ConnectionString=function(){
    this.connectionString;
};
SqlConnection.prototype.Provider=function(){
    this.Provider;
};
SqlConnection.prototype.SetUp=function(){
    /**
     * const config={
     * server: "localhost",
     *  database: "Payments",
     * user:"dbaUser",
     * password:"123@Password"
     * }
     */
    var splitConnectionString=this.connectionString.split(";");
    splitConnectionString.forEach(element => {
        var keyValue=element.split("=")
        if(keyValue.length==2)
        {
            if(Keys.dataSource.includes(keyValue[0].trim().toLowerCase()))
            {
                Config["server"]=keyValue[1];
            }
            else if(Keys.initialCatalog.includes(keyValue[0].trim().toLowerCase()))
            {
                Config["database"]=keyValue[1]
            }
            else if(Keys.username.includes(keyValue[0].trim().toLowerCase())){
                Config["user"]=keyValue[1]
            }
            else if(Keys.password.includes(keyValue[0].trim().toLowerCase())){
                Config["password"]=keyValue[1]
            }
        }
        else if(element.length==1&& Boolean(element[0])){
            throw new Error("Invalid Connection string");
        }
    });
    
};

SqlConnection.prototype.PoolinConfiguration=(min,max,idleTimeoutMillis)=>{
    if(!isNaN(min)&& !isNaN(max)&& max>min &&  isNaN(idleTimeoutMillis))
    {
       Config.pool={
           max:parseInt(max),
           min:parseInt(min),
           idleTimeoutMillis:idleTimeoutMillis
       }
    
    }
    else{
        throw new Error("Invalid Pool Creation Parameter")
    }
}
SqlConnection.prototype.CreateConnection=function(callbackOnConnect){
    var connection=new sql.ConnectionPool(Config);
    if(!callbackOnConnect===undefined){
    connection.on("connect",callbackOnConnect);
    }
    return connection;
}

SqlConnection.prototype.Open=async function(callbackOnConnect,callbackonError){
    this.Connection= await this.CreateConnection(callbackOnConnect);
    if(!callbackonError===undefined){
    this.Connection.on("Error",callbackonError);
    }
    return await this.Connection.connect();

}
SqlConnection.prototype.Close=async function(callbackonError){
   await this.Connection.close(callbackonError);
}
module.exports=SqlConnection;

// module.exports.GetInstance=()=>{
//  var obj=new sql.ConnectionPool(config);
//  obj.on('connect', function(err) {
//     // If no error, then good to proceed.
//         console.log(err);
//     });
//     return obj;
// };