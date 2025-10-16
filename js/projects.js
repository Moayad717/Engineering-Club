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
    html += `
      <div class="card">
        <h3>${project.title}</h3>
        <p style="margin: 1rem 0;">${project.description}</p>
        <p><strong>Majors:</strong> ${majorsText}</p>
        <p><strong>Spots Available:</strong> ${project.spotsAvailable}</p>
        <button onclick="openApplicationModal('${project.id}', '${project.title}')" class="btn-primary" style="margin-top: 1rem;">
          Apply Now
        </button>
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