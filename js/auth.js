// ============================================
// AUTHENTICATION & VERIFICATION
// ============================================

// Check if user is verified
function isVerified() {
  return localStorage.getItem('verified') === 'true';
}

// Get verified email
function getVerifiedEmail() {
  return localStorage.getItem('verifiedEmail');
}

// Store verification
function storeVerification(email) {
  localStorage.setItem('verified', 'true');
  localStorage.setItem('verifiedEmail', email);
}

// Clear verification (logout)
function clearVerification() {
  localStorage.removeItem('verified');
  localStorage.removeItem('verifiedEmail');
}

// Redirect to verify page if not verified
function requireVerification() {
  if (!isVerified()) {
    window.location.href = 'verify.html';
    return false;
  }
  return true;
}

// Update nav with user info
function updateNavigation() {
  const verifiedEmail = getVerifiedEmail();
  const userInfoDiv = document.getElementById('user-info');

  if (userInfoDiv) {
    if (isVerified()) {
      userInfoDiv.innerHTML = `
        <span class="user-email">${verifiedEmail}</span>
        <button onclick="logout()" class="btn-secondary">Logout</button>
      `;
    } else {
      userInfoDiv.innerHTML = `
        <a href="verify.html" class="btn-primary">Verify Email</a>
      `;
    }
  }
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    clearVerification();
    window.location.href = 'index.html';
  }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', updateNavigation);