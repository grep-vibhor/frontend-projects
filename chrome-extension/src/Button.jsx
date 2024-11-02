import '../styles/Button.css'

function SaveButton(props){
    return <button 
            className="green-button"
            onClick={props.onClick}>SAVE
            
            </button>
}

export default SaveButton;