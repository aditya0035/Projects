import React from 'react'
function InputTextComponent(props)
{
    var name=props.name;
    var id=props.id;
    var onChange =props.onChange;
    
    return (
        <div>
            <input type="text" name={name} id={id} onChange={onChange}></input>
        </div>
    )
}

export default InputTextComponent;