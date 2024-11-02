import React from "react"

const LanguageDropDown = (props) => {
  
  console.log(props.value)
  return (
    <div className="dropdown">
    <select 
        className="dropdown-select" 
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="" disabled>
            Select a Language
        </option>

        {props.languages.map((language) => (
          <option 
              key={language.value} 
              value={language.value}
          >
          {language.title}
          </option>
        ))}
    </select>
</div>
  )
};

export default LanguageDropDown;
