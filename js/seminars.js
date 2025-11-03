// Load seminars on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSeminars();
});

async function loadSeminars() {
  showLoading('seminars-list');

  const result = await callAPI('getSeminars');

  if (result.success) {
    displaySeminars(result.data.seminars);
  } else {
    showError('seminars-list', result.message);
  }
}

function displaySeminars(seminars) {
  const container = document.getElementById('seminars-list');

  if (seminars.length === 0) {
    container.innerHTML = '<div class="card">No upcoming seminars at this time. Check back soon!</div>';
    return;
  }

  let html = '';

  seminars.forEach(seminar => {
    const date = new Date(seminar.date);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const bcolor = seminar.type === 'Workshop' ? '#d1e7ddff' : '#cff4fcff';
    html += `
      <div class="card" style="background: ${bcolor}; border: 1px solid #2a2a2aff;">
        <h3>${seminar.topic}</h3>
        <p style="margin: 1rem 0;"><strong>Speaker:</strong> ${seminar.speaker}</p>
        <p><strong>📅 Date:</strong> TBD</p>
        <p><strong>🕐 Time:</strong> ${seminar.time}</p>
        <p><strong>📍 Location:</strong> ${seminar.location}</p>
        <p><strong>📝 Type:</strong> ${seminar.type}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}