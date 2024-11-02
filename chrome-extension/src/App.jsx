import { useEffect,useState } from "react"
import Input from "./Input.jsx"
import SaveButton from "./Button.jsx"
import DeleteButton from "./DeleteButton.jsx"

import InputList from "./InputList.jsx"
import '../styles/common.css'

function App() {

  const [listItems, setListItems] = useState([])
  const [inputValue, setInputValue] = useState("")
  
  const listElements = listItems.map(i => <li key={i}>{i}</li>)

  
  useEffect(() => {
    const storedItems = []
    let i = 0
    let item = localStorage.getItem(i)
    
    // Keep reading from localStorage until we find an empty slot
    while (item !== null) {
      storedItems.push(item)
      i++
      item = localStorage.getItem(i)
    }
    
    if (storedItems.length > 0) {
      setListItems(storedItems)
    }
  }, []) // Empty dependency array means this runs once on mount


  function SaveList() {
      setListItems(prevListItems => {
        const newListItems = [...prevListItems, inputValue]
        // Clear previous items from localStorage first
        localStorage.clear()
        
        for (let i=0; i< newListItems.length;i++){
          localStorage.setItem(i,newListItems[i])
        }
        return newListItems
      }
    )
      setInputValue("") // Clear input after saving
  }  

  function handleInputChange(e){
    setInputValue(e.target.value)
  }
  
  function DeleteList(){
    localStorage.clear()
    setInputValue("")
    setListItems([])
  }

  return (
    <div className="common-container">
      <Input inputValue={inputValue} handleChange={handleInputChange}/>
         <SaveButton onClick={SaveList}/>
         <DeleteButton onClick={DeleteList}/>     
      <InputList listElements={listElements}/>
      
    </div>
  )
}

export default App
