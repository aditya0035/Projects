import React from 'react'
function InputDateComponent(props){
    var name=props.name;
    var id=props.id;
    var onChange =props.onChange;
    return(
        <div>
            <input id={id} type="date" name={name} onChange={onChange}></input>
        </div>
    )
}


export default InputDateComponent