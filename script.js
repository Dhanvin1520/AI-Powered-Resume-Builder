document.getElementById('addEducation').addEventListener('click', function() {
    const educationEntry = document.querySelector('.education-entry').cloneNode(true);
    educationEntry.querySelectorAll('input').forEach(input => input.value = '');
document.getElementById('educationContainer').appendChild(educationEntry);
});

document.getElementById('addProject').addEventListener('click', function() {
    const projectEntry = document.querySelector('.project-entry').cloneNode(true);
 projectEntry.querySelectorAll('input, textarea').forEach(input => input.value = '');
    document.getElementById('projectsContainer').appendChild(projectEntry);
});

document.getElementById('addSkill').addEventListener('click', function() {
    const skillEntry = document.querySelector('.skill-entry').cloneNode(true);
skillEntry.querySelector('input').value = '';
    document.getElementById('skillsContainer').appendChild(skillEntry);
});

document.getElementById('skillsContainer').addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-skill')) {
        e.target.closest('.skill-entry').remove();
    }
});

document.getElementById('generateResume').addEventListener('click', function() {
    const previewPanel = document.getElementById('previewPanel');
    previewPanel.classList.remove('hidden');

    document.getElementById('previewName').textContent = document.getElementById('fullName').value;
    document.getElementById('previewPhone').textContent = 'Phone: ' + document.getElementById('phone').value;
document.getElementById('previewEmail').textContent = 'Email: ' + document.getElementById('email').value;

    const links = ['linkedin', 'github', 'portfolio'];
const previewLinks = document.getElementById('previewLinks');
    previewLinks.innerHTML = '';
    links.forEach(link => {
        const value = document.getElementById(link).value;
        if (value) {
            const a = document.createElement('a');
            a.href = value;
            a.textContent = link.charAt(0).toUpperCase() + link.slice(1);
  a.className = 'text-blue-600 hover:underline';
            previewLinks.appendChild(a);
        }
    });

    document.getElementById('previewSummary').textContent = document.getElementById('summary').value;

    const educationEntries = document.querySelectorAll('.education-entry');
    const previewEducation = document.getElementById('previewEducation');
    previewEducation.innerHTML = '';
 educationEntries.forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        const educationHtml = `
            <div>
                <h3 class="font-medium">${inputs[0].value}</h3>
                <p class="text-sm text-gray-600">${inputs[1].value} • ${inputs[2].value} - ${inputs[3].value}</p>
                <p class="text-sm text-gray-600">Grade: ${inputs[4].value}</p>
            </div>
        `;
        previewEducation.innerHTML += educationHtml;
    });

    const experienceSection = document.getElementById('previewExperienceSection');
    const jobTitle = document.getElementById('jobTitle').value;
    if (jobTitle) {
        experienceSection.classList.remove('hidden');
     const experienceHtml = `
            <div>
                <h3 class="font-medium">${jobTitle}</h3>
                <p class="text-sm text-gray-600">${document.getElementById('company').value} • ${document.getElementById('jobStartDate').value} - ${document.getElementById('jobEndDate').value}</p>
                <p class="text-sm text-gray-600">${document.getElementById('jobDescription').value}</p>
            </div>
        `;
        document.getElementById('previewExperience').innerHTML = experienceHtml;
    } else {
        experienceSection.classList.add('hidden');
    }

    const projectEntries = document.querySelectorAll('.project-entry');
    const previewProjects = document.getElementById('previewProjects');
    previewProjects.innerHTML = '';
projectEntries.forEach(entry => {
        const inputs = entry.querySelectorAll('input, textarea');
        const projectHtml = `
            <div>
                <h3 class="font-medium">${inputs[0].value}</h3>
                <p class="text-sm text-gray-600">${inputs[1].value}</p>
                <div class="mt-1 flex gap-4">
                    ${inputs[2].value ? `<a href="${inputs[2].value}" class="text-sm text-blue-600 hover:underline">GitHub</a>` : ''}
                    ${inputs[3].value ? `<a href="${inputs[3].value}" class="text-sm text-blue-600 hover:underline">Demo</a>` : ''}
                </div>
            </div>
        `;
        previewProjects.innerHTML += projectHtml;
    });

    const skillInputs = document.querySelectorAll('.skill-entry input');
    const previewSkills = document.getElementById('previewSkills');
previewSkills.innerHTML = '';
    skillInputs.forEach(input => {
        if (input.value.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = input.value;
            previewSkills.appendChild(li);
        }
    });

    document.getElementById('previewCertifications').textContent = document.getElementById('certifications').value;
    document.getElementById('previewActivities').textContent = document.getElementById('activities').value;
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resumeContent = document.getElementById('previewPanel');

    html2canvas(resumeContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        doc.save('resume.pdf');
    });
});