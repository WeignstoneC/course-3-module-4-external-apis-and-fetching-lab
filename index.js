// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// DOM Elements
const stateInput = document.getElementById('state-input')
const fetchButton = document.getElementById('fetch-alerts')
const alertsDisplay = document.getElementById('alerts-display')
const errorMessage = document.getElementById('error-message')

// Event Listener
fetchButton.addEventListener('click', handleFetch)

// Step 1: Fetch Alerts for a State from the API
async function fetchWeatherAlerts(state) {
  const response = await fetch(`${weatherApi}${state}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch weather alerts for ${state}`)
  }
  const data = await response.json()
  console.log(data)
  return data
}

// Step 2: Display the Alerts on the Page
function displayAlerts(data) {
  // Clear previous content
  alertsDisplay.innerHTML = ''
  
  // Get title and number of alerts
  const title = data.title || 'Weather Alerts'
  const alertCount = data.features ? data.features.length : 0
  
  // Create summary message
  const summary = document.createElement('p')
  summary.textContent = `${title}: ${alertCount}`
  alertsDisplay.appendChild(summary)
  
  // Create list of alert headlines
  if (data.features && data.features.length > 0) {
    const ul = document.createElement('ul')
    data.features.forEach(alert => {
      const li = document.createElement('li')
      li.textContent = alert.properties.headline
      ul.appendChild(li)
    })
    alertsDisplay.appendChild(ul)
  }
}

// Step 4: Display Error Message
function displayError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
}

// Clear Error Message
function clearError() {
  errorMessage.textContent = ''
  errorMessage.classList.add('hidden')
}

// Main Handler
async function handleFetch() {
  const state = stateInput.value.trim().toUpperCase()
  
  // Clear previous data
  clearError()
  alertsDisplay.innerHTML = ''
  
  // Validate input
  if (!state) {
    displayError('Please enter a state abbreviation')
    return
  }
  
  if (state.length !== 2 || !/^[A-Z]{2}$/.test(state)) {
    displayError('Please enter a valid two-letter state abbreviation')
    return
  }
  
  try {
    const data = await fetchWeatherAlerts(state)
    displayAlerts(data)
    // Step 3: Clear the input field
    stateInput.value = ''
  } catch (error) {
    displayError(error.message)
  }
}
