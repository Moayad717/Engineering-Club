// Check verification and load data on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!requireVerification()) return;
  loadDashboardData();
});

async function loadDashboardData() {
  showLoading('applications-list');
  showLoading('volunteers-list');
  
  const email = getVerifiedEmail();
  const result = await callAPI('getMyApplications', { email: email });
  
  if (result.success) {
    displayApplications(result.data.applications);
    displayVolunteers(result.data.volunteers);
  } else {
    showError('applications-list', result.message);
    showError('volunteers-list', result.message);
  }
}

function displayApplications(applications) {
  const container = document.getElementById('applications-list');
  
  if (applications.length === 0) {
    container.innerHTML = '<p style="color: #7f8c8d; margin-top: 1rem;">You haven\'t applied to any projects yet. <a href="projects.html">Browse projects</a></p>';
    return;
  }
  
  let html = '<table style="margin-top: 1rem;"><thead><tr><th>Project</th><th>Applied On</th><th>Status</th></tr></thead><tbody>';
  
  applications.forEach(app => {
    const date = new Date(app.timestamp);
    const dateStr = date.toLocaleDateString('en-US');
    
    let statusBadge = '';
    if (app.status === 'pending') {
      statusBadge = '<span class="badge badge-pending">Pending</span>';
    } else if (app.status === 'approved') {
      statusBadge = '<span class="badge badge-approved">Approved</span>';
    } else if (app.status === 'rejected') {
      statusBadge = '<span class="badge badge-rejected">Rejected</span>';
    }
    
    html += `
      <tr>
        <td>${app.projectTitle}</td>
        <td>${dateStr}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function displayVolunteers(volunteers) {
  const container = document.getElementById('volunteers-list');
  
  if (volunteers.length === 0) {
    container.innerHTML = '<p style="color: #7f8c8d; margin-top: 1rem;">You haven\'t volunteered for any events yet. <a href="events.html">View events</a></p>';
    return;
  }
  
  let html = '<table style="margin-top: 1rem;"><thead><tr><th>Event</th><th>Role</th><th>Registered On</th></tr></thead><tbody>';
  
  volunteers.forEach(vol => {
    const date = new Date(vol.timestamp);
    const dateStr = date.toLocaleDateString('en-US');
    
    html += `
      <tr>
        <td>${vol.eventTitle}</td>
        <td>${vol.role}</td>
        <td>${dateStr}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}