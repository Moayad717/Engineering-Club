let selectedEvent = null;

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
});

async function loadEvents() {
  showLoading('events-list');
  
  const result = await callAPI('getEvents');
  
  if (result.success) {
    displayEvents(result.data.events);
  } else {
    showError('events-list', result.message);
  }
}

function displayEvents(events) {
  const container = document.getElementById('events-list');
  
  if (events.length === 0) {
    container.innerHTML = '<div class="card">No upcoming events at this time. Check back soon!</div>';
    return;
  }
  
  let html = '<div class="card-grid">';
  
  events.forEach(event => {
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    html += `
      <div class="card">
        <h3>${event.title}</h3>
        <p style="margin: 1rem 0;">${event.description}</p>
        <p><strong>📅 Date:</strong> ${dateStr}</p>
    `;

    if (event.type === 1) { // Volunteer Event
      const escapedId = encodeURIComponent(event.id);
      const escapedTitle = encodeURIComponent(event.title);
      html += `
          <button
              onclick="openVolunteerModal('${escapedId}', '${escapedTitle}')" 
              class="btn-primary"
              style="margin-top: 1rem;">
              Volunteer to Help
          </button>`;
    }
    html += `</div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}

function openVolunteerModal(eventId, eventTitle) {
    if (!requireVerification()) return;

    // Decode the escaped values
    const decodedId = decodeURIComponent(eventId);
    const decodedTitle = decodeURIComponent(eventTitle);
    selectedEvent = {
        id: decodedId,
        title: decodedTitle
    };

    const titleElement = document.getElementById('modal-event-title');
    titleElement.textContent = decodedTitle;
    document.getElementById('volunteer-modal').style.display = 'block';
    document.getElementById('modal-message').innerHTML = '';
}

function closeVolunteerModal() {
  document.getElementById('volunteer-modal').style.display = 'none';
  selectedEvent = null;
  // Clear form
  document.getElementById('volunteer-name').value = '';
  document.getElementById('volunteer-major').value = '';
  document.getElementById('volunteer-role').value = 'General Helper';
}

async function submitVolunteer() {
  const name = document.getElementById('volunteer-name').value.trim();
  const major = document.getElementById('volunteer-major').value;
  const role = document.getElementById('volunteer-role').value;
  
  if (!name || !major) {
    showError('modal-message', 'Please fill in all required fields');
    return;
  }
  
  showLoading('modal-message');
  
  const data = {
    email: getVerifiedEmail(),
    name: name,
    major: major,
    eventId: selectedEvent.id,
    eventTitle: selectedEvent.title,
    role: role
  };
  
  const result = await callAPI('submitVolunteer', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('modal-message', 'Thank you for volunteering! We\'ll contact you soon.');
    setTimeout(() => {
      closeVolunteerModal();
    }, 2000);
  } else {
    showError('modal-message', result.message);
  }
}