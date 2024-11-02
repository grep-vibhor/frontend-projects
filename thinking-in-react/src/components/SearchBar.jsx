import React from "react"

const SearchBar = () => {

  const [inputValue, setInputValue] = React.useState("")
  const [inStock, setInStock] = React.useState(false)

  const handleInput = (e) => {
    setInputValue(e.target.value)
  }

  const handleCheck = (e) => {
    setInStock(e.target.checked)
  }
  
  return (
   <form>
    <input type="text" placeholder="Search" value={inputValue} onChange={handleInput}/>
    <div>
      <input id="checkbox" type="checkbox" checked={inStock} onClick={handleCheck}/>
      <label htmlFor="checkbox">Only show products in stock</label>
    </div>
   </form>
  )
};

export default SearchBar;
