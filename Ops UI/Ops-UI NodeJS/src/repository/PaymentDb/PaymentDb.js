const mssql=require("mssql/msnodesqlv8")
const connectionString=process.env.ConnectionString||"server={localhost};Database={Payments};Trusted_Connection={Yes};;Driver={SQL Server Native Client 11.0;}";
const pool=new mssql.ConnectionPool(connectionString,(erro)=>{
    if(erro){
        throw new Error("Something went wrong",erro)
    }
    else{
        console.log("Connected Successfully")
    }
});

module.exports.GetInstance=async()=>{
        if(!pool.connected){
            pool.connect();
        }
        return await pool;
}