import '../styles/Button.css'


function DeleteButton(props){
    return <button 
                className="green-button"
                onClick={props.onClick}>
                    DELETE
                </button>
}

export default DeleteButton;