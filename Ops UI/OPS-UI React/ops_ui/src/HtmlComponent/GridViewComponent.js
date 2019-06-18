import React from 'react'
export default class GridViewComponent extends React.Component{
    state={
        columns:this.props.columns,
        data:this.props.data,
        mappingKey:this.props.mappingKey,
    }
    gridHeader=this.state.columns.map(column=>{
        return (<td key={column.name}>{column.description}</td>)
    });
    fetchAllDetails=(e)=>{
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data }); 
    }
     GenerateRows=(data)=>{
         var rows= (data.map(row=>{
            return (<tr onClick={this.fetchAllDetails} key={row[this.state.mappingKey]}>
                {this.state.columns.map(column=>{
                return (<td key={column.name}>
                    {column.format?column.format(row[column.name]):row[column.name]}
                </td>)
            })}
            </tr>)
        }));
        return rows;
    } 
    render(){
        return(
            <div> 
            <table>
                <thead>
                <tr>{this.gridHeader}</tr>
                </thead>
                <tbody>
                {this.GenerateRows(this.state.data)}
                </tbody>
            </table>
            </div>
        )
    }
}