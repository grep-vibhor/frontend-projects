export async function getCurrentLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const text = await response.json()
    return JSON.stringify(text)
  } catch (err) {
    console.log(err)
  }
}

export async function getCurrentWeather({location, unit="F"}){
    return JSON.stringify({
        location,
        value: 45,
        unit
    })
}

export const tools = [
    {
      "type": "function",
      "function": {
        "name": "getCurrentWeather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
            location: {
              type: "string",
              description: "The location from where to get the weather"
            },
            unit: {
              type: "string",
            }
          },
          required: ["location"]
        },
      }
    },
    {
        "type": "function",
        "function": {
          "name": "getCurrentLocation",
          "description": "Get the current location",
          "parameters": {
            "type": "object",
            "properties": {}
          },
        }
      }
];