import React from 'react'
import '../styles/Input.css'

function Input(props){
    return (
            <input  
                className="green-input" 
                value={props.inputValue} 
                onChange={props.handleChange} 
                type="text"
                />

    )

}

export default Input;