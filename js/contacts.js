function filterContacts() {
  const dept = document.querySelector('#contact-dept').value;
  const contact = document.querySelector('.contact-grid');

  const defaultHTML = `
        <div class="contact-card">
          <h3>Moayad Salloum</h3>

          <div>
            <strong>📧 Email:</strong><br>
            <a href="mailto:22230296@students.liu.edu.lb">
              22230296@students.liu.edu.lb
            </a>
          </div>

          <div>
            <strong>💬 WhatsApp:</strong><br>
            <a href="https://wa.me/96181093491">
              +961 81 093 491
            </a>
          </div>
        </div>

        <!-- Contact 2: Yousef Younis -->
        <div class="contact-card">
          <h3>Yousef Younis</h3>

          <div>
            <strong>📧 Email:</strong><br>
            <a href="mailto:22230294@students.liu.edu.lb">
              22230294@students.liu.edu.lb
            </a>
          </div>

          <div>
            <strong>💬 WhatsApp:</strong><br>
            <a href="https://wa.me/96170865988">
              +961 70 865 988
            </a>
          </div>
        </div>
        `;

  switch (dept){
    case 'all':
        contact.innerHTML = defaultHTML;
        break;

    case 'electrical':
        contact.innerHTML = `
        <div class="contact-card">
          <h3>Maher Khorfan</h3>

          <div>
            <strong>📧 Email:</strong><br>
            <a href="mailto:22230887@students.liu.edu.lb">
              22230887@students.liu.edu.lb
            </a>
          </div>

          <div>
            <strong>💬 WhatsApp:</strong><br>
            <a href="https://wa.me/96178912518">
              +961 78 912 518
            </a>
          </div>
        </div>
        `;
        break;

    case 'computer':
        contact.innerHTML = defaultHTML;
        break;

    case 'mechanical':
        contact.innerHTML = `
        <div class="contact-card">
          <h3>No assigned yet</h3>

          <div>
            <strong>📧 Email:</strong><br>
            <a>
              NA
            </a>
          </div>

          <div>
            <strong>💬 WhatsApp:</strong><br>
            <a>
              NA
            </a>
          </div>
        </div>
        `;
        break;

    case 'biomedical':
        contact.innerHTML = `
        <div class="contact-card">
          <h3>No assigned yet</h3>

          <div>
            <strong>📧 Email:</strong><br>
            <a>
              NA
            </a>
          </div>

          <div>
            <strong>💬 WhatsApp:</strong><br>
            <a>
              NA
            </a>
          </div>
        </div>
        `;
        break;

    default:
        contact.innerHTML = defaultHTML;
        break;
  }
}