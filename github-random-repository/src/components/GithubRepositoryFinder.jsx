import React from "react"
import Header from "./Header";
import LanguageDropDown from "./LanguageDropDown";
import GithubRepository from "./GithubRepository";
import {languages} from "../data/languages"


const GithubRepositoryFinder = () => {

  const [selectedLanguage, setSelectedLanguage] = React.useState('')

  const [show, setShow] = React.useState(true)


  const handleChange = (newValue) => {
    setSelectedLanguage(newValue)
    setShow(false)
  }

  
  
  return (
    <div className="container">
      <Header />
      <LanguageDropDown 
        languages={languages} 
        value={selectedLanguage} 
        onChange={handleChange}
      />
      
      <GithubRepository 
        language={selectedLanguage} 
        show={show}
      />
    </div>
  )
};

export default GithubRepositoryFinder;
