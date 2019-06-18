import React from 'react'
import {Route} from 'react-router-dom'
import SearchComponent from '../src/FunctionalComponent/SearchScreenComponent'
function Navigation(){
    return(<div>
        <Route path='/' component={SearchComponent}></Route>
    </div>)
}

export default Navigation