`agent_from_scratch.js` = pass custom system prompt and then parse the output string to get Actions and call the function 

`agent_openai_functions.js` = use open ai tools array to teach model which tool/function to call but without parameters 


`agent_openai_functions_with_parameters.js` = use open ai tools array to teach model which tool/function to call with parameters



All this is now moved to assistants API:

`agent_assistants_api.js` : imeplemented using https://platform.openai.com/docs/assistants/tools/function-calling



