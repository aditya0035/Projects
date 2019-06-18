const sql=require("mssql")
const dataTable=require("./DataTable")
const CommandType={
    Text:"query",
    StoredProceure:"proc"
}
const ParameterDirection={
    Input:"Input",
    Output:"Output"
}
const SqlDataType={
    Int:"Int",
    Varchar:"Varchar"
}

function SqlCommand(Query=null,Connection=null){
    this.CommandText=Query;
    this.Connection=Connection;
    this.CommandType=null;
}
SqlCommand.prototype.CommandText=function(value){
    if(value===undefined){
        return this.CommandText;
    }else{
        this.CommandText=value
    }
}
SqlCommand.prototype.Parameter={Input:[],Output:[]};
SqlCommand.prototype.Parameter.Add=function(name,type,direction,size=1,value=null){
            if(direction===ParameterDirection.Input){
                this.Input.push({name:name,type:ConvertToSqlDataType(type,size),value:value})
            }
            else if(direction===ParameterDirection.Output){
                this.Output.push({name:name,type:ConvertToSqlDataType(type,size),value:value})
            }
            else{
                throw new Error("Invalid Parameter Direction")
            }
}
SqlCommand.prototype.CommandType=function(value){
    if(value===CommandType.Text){
        this.CommandType=CommandType.Text;
    }
    else if(value===CommandType.StoredProceure){
        this.CommandType=CommandType.StoredProceure;
    }
    else{
        throw new Error("Invalid SQL Command Type");
    }
}
SqlCommand.prototype.Connection=function(){
    return this.Connection;
}
SqlCommand.prototype.ExecuteReader=function(callback){
    this.Connection.Open(()=>{
        console.log("Connected")
    },(err)=>{
        console.log("error",err)
    }).then(async (connectionPool)=>{
        var request=connectionPool.request();
        var currentTable=null;
        request.stream=true;
        var dataset=[];
        if(this.Parameter.Input.length>0){
            this.Parameter.Input.forEach(item=>{
                request.input(item.name,item.type,item.value);
            });
        }
        if(this.Parameter.Output.length>0){
            this.Parameter.Output.forEach(item=>{
                request.Output(item.name,item.type);
            });
        }

        if(this.CommandType===CommandType.Text){
            request.query(this.CommandText);
        }
        else if(this.CommandType===CommandType.StoredProceure){
            request.execute(this.CommandText)
        }

        request.on("recordset",column=>{
            //logic to create table
           currentTable=new dataTable(column)
           dataset.push(currentTable);
        });
        request.on("row",row=>{
            currentTable.AddRow(row);
        });
        request.on("error",error=>{
            console.log(error)
        });
        request.on("done",(result)=>{
            this.Connection.Close((error)=>{
                console.log("connection closed")
            });
           callback(dataset);
        });
    });
}

function ConvertToSqlDataType(type,size){
    if(type===SqlDataType.Int){
        return sql.Int
    }
    else if(type===SqlDataType.Varchar){
        return sql.VarChar(size)
    }
}
module.exports=SqlCommand
module.exports.CommandType=CommandType