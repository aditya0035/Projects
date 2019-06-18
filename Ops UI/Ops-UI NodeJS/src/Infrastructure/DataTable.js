const mssql=require("mssql")
function DataTable(columns){
   this.DataTable={};
   this.Columns=[]
   for (const columnName in columns) {
     this.DataTable[columnName]=[];
      this.Columns[columnName]={name:columnName,type:columns[columnName].type[0]}
   }
};
DataTable.prototype.AddRow=function(row){

      for (const property in row) {
         if(this.DataTable[property]===undefined){
            throw new Error("Property Not The part of Column")
         }
         else{
            this.DataTable[property]=row[property]
         }
      }
}
module.exports=DataTable;

