// ============================================
// API CALLS TO APPS SCRIPT
// ============================================

async function callAPI(action, params = {}, method = 'GET', body = null) {
  try {
    let url = `${CONFIG.API_URL}?action=${action}`;

    // Add GET parameters
    for (const [key, value] of Object.entries(params)) {
      url += `&${key}=${encodeURIComponent(value)}`;
    }

    const options = {
      method: method,
      redirect: 'follow'
    };

    // Add body for POST requests
    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return data;

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Connection error. Please try again.'
    };
  }
}

// Show loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading">Loading...</div>';
  }
}

// Show error message
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Show success message
function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `<div class="success">${message}</div>`;
  }
}