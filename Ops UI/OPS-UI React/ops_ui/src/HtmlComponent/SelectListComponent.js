import React from 'react'
function SelectListComponent(props){
   var name=props.name;
   var id=props.id;
   var optionsList=props.optionsList;
   var OnChange=props.onChange;
    var options=optionsList.map((item)=>{
        return(
            <option key={item.value} value={item.value}>{item.text}</option>
            );
    });
    return (
        <div>
            <select name={name} id={id} onChange={OnChange}>
                {options}
            </select>
        </div>
    )
}

export default SelectListComponent;