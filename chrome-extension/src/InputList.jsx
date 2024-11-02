import '../styles/common.css'

function InputList(props){
    return (
        <div className="list-container">
            <ul className="list-items">
                {props.listElements}
            </ul>
      </div>
    )
}

export default InputList;