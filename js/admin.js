let adminPassword = '';
let allApplications = [];
let allVolunteers = [];
let allProjects = [];

// Set default archive dates
document.addEventListener('DOMContentLoaded', () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dateStr = threeMonthsAgo.toISOString().split('T')[0];
  
  const appsDate = document.getElementById('archive-apps-date');
  const volsDate = document.getElementById('archive-vols-date');
  if (appsDate) appsDate.value = dateStr;
  if (volsDate) volsDate.value = dateStr;
});

async function adminLogin() {
  const password = document.getElementById('admin-password').value.trim();
  
  if (!password) {
    showError('login-message', 'Please enter password');
    return;
  }
  
  showLoading('login-message');
  
  const result = await callAPI('adminLogin', { password: password });
  
  if (result.success) {
    adminPassword = password;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    loadAllData();
  } else {
    showError('login-message', 'Invalid password');
  }
}

async function loadAllData() {
  await loadApplications();
  await loadVolunteers();
  await loadProjects();
  updateStats();
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById('tab-' + tabName).classList.add('active');
  event.target.classList.add('active');
}

async function loadApplications() {
  showLoading('applications-admin');
  
  const result = await callAPI('getApplicationsAdmin', { password: adminPassword });
  
  if (result.success) {
    allApplications = result.data.applications;
    filterApplications();
    updateStats();
  } else {
    showError('applications-admin', result.message);
  }
}

function filterApplications() {
  const filterElement = document.getElementById('app-filter');
  if (!filterElement) {
    // If filter doesn't exist yet, show all
    displayApplicationsAdmin(allApplications);
    return;
  }
  
  const filter = filterElement.value;
  
  let filtered = allApplications;
  if (filter !== 'all') {
    filtered = allApplications.filter(app => app.status === filter);
  }
  
  displayApplicationsAdmin(filtered);
}

function displayApplicationsAdmin(applications) {
  const container = document.getElementById('applications-admin');
  
  if (!container) {
    console.error('applications-admin container not found');
    return;
  }
  
  if (applications.length === 0) {
    container.innerHTML = '<p style="color: #7f8c8d; margin-top: 1rem;">No applications found.</p>';
    return;
  }
  
  let html = '<div style="overflow-x: auto;"><table style="margin-top: 1rem;"><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Major</th><th>Project</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  
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
    
    let actions = '';
    if (app.status === 'pending') {
      actions = `
        <button onclick="updateStatus(${app.rowIndex}, 'approved')" class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem; margin-right: 0.5rem;">Approve</button>
        <button onclick="updateStatus(${app.rowIndex}, 'rejected')" class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Reject</button>
      `;
    } else {
      actions = `<button onclick="deleteApp(${app.rowIndex})" style="padding: 0.4rem 0.8rem; font-size: 0.9rem; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>`;
    }
    
    html += `
      <tr>
        <td>${dateStr}</td>
        <td>${app.name}</td>
        <td>${app.email}</td>
        <td>${app.major}</td>
        <td>${app.projectTitle}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${app.message || '-'}</td>
        <td>${statusBadge}</td>
        <td>${actions}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

async function updateStatus(rowIndex, status) {
  if (!confirm(`Are you sure you want to ${status} this application?`)) {
    return;
  }
  
  const data = {
    password: adminPassword,
    rowIndex: rowIndex,
    status: status
  };
  
  const result = await callAPI('updateApplicationStatus', {}, 'POST', data);
  
  if (result.success) {
    alert('Status updated! Email sent to student.');
    loadApplications();
  } else {
    alert('Failed: ' + result.message);
  }
}

async function deleteApp(rowIndex) {
  if (!confirm('Permanently delete this application? This cannot be undone.')) {
    return;
  }
  
  const data = {
    password: adminPassword,
    rowIndex: rowIndex
  };
  
  const result = await callAPI('deleteApplication', {}, 'POST', data);
  
  if (result.success) {
    alert('Application deleted');
    loadApplications();
  } else {
    alert('Failed: ' + result.message);
  }
}

async function loadVolunteers() {
  showLoading('volunteers-admin');
  
  const result = await callAPI('getVolunteersAdmin', { password: adminPassword });
  
  if (result.success) {
    allVolunteers = result.data.volunteers;
    displayVolunteersAdmin(allVolunteers);
    updateStats();
  } else {
    showError('volunteers-admin', result.message);
  }
}

function displayVolunteersAdmin(volunteers) {
  const container = document.getElementById('volunteers-admin');
  
  if (!container) {
    console.error('volunteers-admin container not found');
    return;
  }
  
  if (volunteers.length === 0) {
    container.innerHTML = '<p style="color: #7f8c8d; margin-top: 1rem;">No volunteers yet.</p>';
    return;
  }
  
  let html = '<div style="overflow-x: auto;"><table style="margin-top: 1rem;"><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Major</th><th>Event</th><th>Role</th></tr></thead><tbody>';
  
  volunteers.forEach(vol => {
    const date = new Date(vol.timestamp);
    const dateStr = date.toLocaleDateString('en-US');
    
    html += `
      <tr>
        <td>${dateStr}</td>
        <td>${vol.name}</td>
        <td>${vol.email}</td>
        <td>${vol.major}</td>
        <td>${vol.eventTitle}</td>
        <td>${vol.role}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

async function loadProjects() {
  showLoading('projects-admin');
  
  const result = await callAPI('getAllProjects', { password: adminPassword });
  
  if (result.success) {
    allProjects = result.data.projects;
    displayProjectsAdmin(allProjects);
    updateStats();
  } else {
    showError('projects-admin', result.message);
  }
}

function displayProjectsAdmin(projects) {
  const container = document.getElementById('projects-admin');
  
  if (!container) {
    console.error('projects-admin container not found');
    return;
  }
  
  if (projects.length === 0) {
    container.innerHTML = '<p style="color: #7f8c8d; margin-top: 1rem;">No projects yet.</p>';
    return;
  }
  
  let html = '<div style="overflow-x: auto;"><table style="margin-top: 1rem;"><thead><tr><th>ID</th><th>Title</th><th>Majors</th><th>Spots</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  
  projects.forEach(proj => {
    let statusBadge = '';
    if (proj.status === 'active') {
      statusBadge = '<span class="badge badge-approved">Active</span>';
    } else if (proj.status === 'in_progress') {
      statusBadge = '<span class="badge" style="background: #3498db; color: white;">In Progress</span>';
    } else if (proj.status === 'full') {
      statusBadge = '<span class="badge badge-pending">Full</span>';
    } else if (proj.status === 'completed') {
      statusBadge = '<span class="badge" style="background: #95a5a6;">Completed</span>';
    } else if (proj.status === 'archived') {
      statusBadge = '<span class="badge" style="background: #7f8c8d;">Archived</span>';
    }
    
    html += `
      <tr>
        <td>${proj.id}</td>
        <td>${proj.title}</td>
        <td>${proj.majors}</td>
        <td>${proj.spotsAvailable}</td>
        <td>${statusBadge}</td>
        <td>
          <select onchange="changeProjectStatus('${proj.id}', this.value)" style="padding: 0.4rem;">
            <option value="">Change Status...</option>
            <option value="active">✅ Active (Applications Open)</option>
            <option value="in_progress">🚧 In Progress</option>
            <option value="full">⛔ Full (No Applications)</option>
            <option value="completed">✔️ Completed</option>
            <option value="archived">📦 Archived</option>
          </select>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

async function changeProjectStatus(projectId, newStatus) {
  if (!newStatus) return;
  
  const data = {
    password: adminPassword,
    projectId: projectId,
    status: newStatus
  };
  
  const result = await callAPI('updateProjectStatus', {}, 'POST', data);
  
  if (result.success) {
    alert('Project status updated');
    loadProjects();
  } else {
    alert('Failed: ' + result.message);
  }
}

function updateStats() {
  const statPending = document.getElementById('stat-pending');
  const statVolunteers = document.getElementById('stat-volunteers');
  const statActiveProjects = document.getElementById('stat-active-projects');
  
  if (statPending && allApplications.length > 0) {
    const pending = allApplications.filter(app => app.status === 'pending').length;
    statPending.textContent = pending;
  }
  
  if (statVolunteers) {
    statVolunteers.textContent = allVolunteers.length;
  }
  
  if (statActiveProjects && allProjects.length > 0) {
    const activeProjects = allProjects.filter(proj => proj.status === 'active').length;
    statActiveProjects.textContent = activeProjects;
  }
}

// CLEANUP FUNCTIONS

async function archiveApplications() {
  const date = document.getElementById('archive-apps-date').value;
  if (!date) {
    alert('Please select a date');
    return;
  }
  
  if (!confirm(`Archive all applications before ${date}? They will be moved to Archived_Applications sheet.`)) {
    return;
  }
  
  showLoading('cleanup-message');
  
  const data = {
    password: adminPassword,
    cutoffDate: date
  };
  
  const result = await callAPI('archiveOldApplications', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('cleanup-message', result.message);
    loadApplications();
  } else {
    showError('cleanup-message', result.message);
  }
}

async function archiveVolunteers() {
  const date = document.getElementById('archive-vols-date').value;
  if (!date) {
    alert('Please select a date');
    return;
  }
  
  if (!confirm(`Archive all volunteer records before ${date}?`)) {
    return;
  }
  
  showLoading('cleanup-message');
  
  const data = {
    password: adminPassword,
    cutoffDate: date
  };
  
  const result = await callAPI('archiveOldVolunteers', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('cleanup-message', result.message);
    loadVolunteers();
  } else {
    showError('cleanup-message', result.message);
  }
}

async function cleanPastEvents() {
  if (!confirm('Archive all events that have already happened?')) {
    return;
  }
  
  showLoading('cleanup-message');
  
  const data = { password: adminPassword };
  
  const result = await callAPI('deletePastEvents', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('cleanup-message', result.message);
  } else {
    showError('cleanup-message', result.message);
  }
}

async function cleanPastSeminars() {
  if (!confirm('Archive all seminars that have already happened?')) {
    return;
  }
  
  showLoading('cleanup-message');
  
  const data = { password: adminPassword };
  
  const result = await callAPI('deletePastSeminars', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('cleanup-message', result.message);
  } else {
    showError('cleanup-message', result.message);
  }
}