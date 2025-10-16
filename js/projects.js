let allProjects = [];
let currentFilter = 'All';
let selectedProject = null;

// Load projects on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});

async function loadProjects() {
  showLoading('projects-list');
  
  const result = await callAPI('getProjects', { major: 'All' });
  
  if (result.success) {
    allProjects = result.data.projects;
    displayProjects(allProjects);
  } else {
    showError('projects-list', result.message);
  }
}

function displayProjects(projects) {
  const container = document.getElementById('projects-list');
  
  if (projects.length === 0) {
    container.innerHTML = '<div class="card">No projects found for this major.</div>';
    return;
  }
  
  let html = '<div class="card-grid">';
  
  projects.forEach(project => {
    const majorsText = project.majors.join(', ');
    
    // Determine if applications are open
    const canApply = project.status === 'active';
    
    // Status badge
    let statusBadge = '';
    let buttonHtml = '';
    
    if (project.status === 'active') {
      statusBadge = '<span class="badge badge-approved">Open for Applications</span>';
      buttonHtml = `
        <button onclick="openApplicationModal('${project.id}', '${project.title}')" class="btn-primary" style="margin-top: 1rem;">
          Apply Now
        </button>
      `;
    } else if (project.status === 'full') {
      statusBadge = '<span class="badge badge-pending">Full - Applications Closed</span>';
      buttonHtml = '<button class="btn-secondary" style="margin-top: 1rem; cursor: not-allowed;" disabled>Project Full</button>';
    } else if (project.status === 'in_progress') {
      statusBadge = '<span class="badge" style="background: #3498db; color: white;">In Progress</span>';
      buttonHtml = '<button class="btn-secondary" style="margin-top: 1rem; cursor: not-allowed;" disabled>In Progress</button>';
    } else if (project.status === 'completed') {
      statusBadge = '<span class="badge" style="background: #95a5a6; color: white;">Completed</span>';
      buttonHtml = '<button class="btn-secondary" style="margin-top: 1rem; cursor: not-allowed;" disabled>Completed</button>';
    }
    
    html += `
      <div class="card">
        <div style="margin-bottom: 1rem;">${statusBadge}</div>
        <h3>${project.title}</h3>
        <p style="margin: 1rem 0;">${project.description}</p>
        <p><strong>Majors:</strong> ${majorsText}</p>
        <p><strong>Spots Available:</strong> ${project.spotsAvailable}</p>
        ${buttonHtml}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function filterProjects(major) {
  currentFilter = major;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter projects
  if (major === 'All') {
    displayProjects(allProjects);
  } else {
    const filtered = allProjects.filter(p => p.majors.includes(major));
    displayProjects(filtered);
  }
}

function openApplicationModal(projectId, projectTitle) {
  // Check if verified
  if (!requireVerification()) return;
  
  selectedProject = { id: projectId, title: projectTitle };
  document.getElementById('modal-project-title').textContent = projectTitle;
  document.getElementById('application-modal').style.display = 'block';
  document.getElementById('modal-message').innerHTML = '';
}

function closeModal() {
  document.getElementById('application-modal').style.display = 'none';
  selectedProject = null;
  // Clear form
  document.getElementById('applicant-name').value = '';
  document.getElementById('applicant-major').value = '';
  document.getElementById('applicant-message').value = '';
}

async function submitApplication() {
  const name = document.getElementById('applicant-name').value.trim();
  const major = document.getElementById('applicant-major').value;
  const message = document.getElementById('applicant-message').value.trim();
  
  if (!name || !major) {
    showError('modal-message', 'Please fill in all required fields');
    return;
  }
  
  showLoading('modal-message');
  
  const data = {
    email: getVerifiedEmail(),
    name: name,
    major: major,
    projectId: selectedProject.id,
    projectTitle: selectedProject.title,
    message: message
  };
  
  const result = await callAPI('submitApplication', {}, 'POST', data);
  
  if (result.success) {
    showSuccess('modal-message', 'Application submitted! Check your dashboard for status.');
    setTimeout(() => {
      closeModal();
    }, 2000);
  } else {
    showError('modal-message', result.message);
  }
}