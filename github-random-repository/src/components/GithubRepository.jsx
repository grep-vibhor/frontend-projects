import React, { useEffect } from "react"

const  apiURL = "https://api.github.com/search/repositories?per_page=100&q=language:"

const GithubRepository = (props) => {


  const [repositoryDetails, setRepositoryDetails]  = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function getRepository(){
    const url = apiURL + props.language.toLowerCase()
    
    // reset these states
    setError(null)
    setIsLoading(true)

    try{
      const response = await fetch(url,{
        method: "GET",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": "Bearer <token>"
        }
      })
      if (!response.ok){
        throw new Error(`GitHub API error: ${response.status}`);
      }


      const data = await response.json()

      if (!data.items?.length) {
        throw new Error('No repositories found');
      }

      
      const randomIndex = Math.floor(Math.random() * 100)
      
      setRepositoryDetails ({
        name: data.items[randomIndex].name, 
        description: data.items[randomIndex].description,
        open_issues_count: data.items[randomIndex].open_issues_count.toString(),
        forks_count: data.items[randomIndex].forks_count.toString()
      })
    }
    catch(err){
      setError(err.message);
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRepository()
  },[props.language])
  

  
  return (
    <>
    <div className="content-area" id="contentArea">
        
        {props.show ? 
                (<div className="language-title">Please select a language</div>)
        
              :
              (
                <>
                  {isLoading && (
                    <div className="text-gray-600">Loading repository details...</div>
                  )}

                  {error && (
                              <div className="text-red-600">
                                Error: {error}
                              </div>
                            )}

                  {
                        !isLoading && !error && repositoryDetails &&    
                            (
                              <div className="repository-details">
                            
                              Name: {repositoryDetails.name}
                              <br/>
                              Description: {repositoryDetails.description}
                              <br/>
                              Open Issues: {repositoryDetails.open_issues_count}
                              <br/>
                              Number of Forks: {repositoryDetails.forks_count}
                              <br/>
                            
                            </div>
                        )
                  }
                </>
              )
        }
 
    </div>
    <button className="retry-button" id="retryButton">Click to retry</button>
    </>
  )
};

export default GithubRepository;
