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
                <h3>${inputs[0].value}</h3>
                <p class="resume-text">${inputs[1].value} • ${inputs[2].value} - ${inputs[3].value}</p>
                <p class="resume-text">Grade: ${inputs[4].value}</p>
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
                <h3>${jobTitle}</h3>
                <p class="resume-text">${document.getElementById('company').value} • ${document.getElementById('jobStartDate').value} - ${document.getElementById('jobEndDate').value}</p>
                <p class="resume-text">${document.getElementById('jobDescription').value}</p>
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
                <h3>${inputs[0].value}</h3>
                <p class="resume-text">${inputs[1].value}</p>
                <div class="links">
                    ${inputs[2].value ? `<a href="${inputs[2].value}">GitHub</a>` : ''}
                    ${inputs[3].value ? `<a href="${inputs[3].value}">Demo</a>` : ''}
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
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;

    function addText(text, x, y, options = {}) {
        if (!text) return y;
        const defaults = {
            align: 'left',
            maxWidth: pageWidth - (margin * 2),
            fontSize: 12,
            fontStyle: 'normal',
            link: null
        };
        const settings = {...defaults, ...options};
        doc.setFontSize(settings.fontSize);
        doc.setFont(undefined, settings.fontStyle);
        if (settings.align === 'right') {
            x = pageWidth - margin;
        }
        const lines = doc.splitTextToSize(text, settings.maxWidth);
        doc.text(lines, x, y, { align: settings.align });
        if (settings.link) {
            const textWidth = doc.getTextWidth(text);
            const height = settings.fontSize / 3;
            if (settings.align === 'left') {
                doc.link(x, y - height, textWidth, height, { url: settings.link });
            } else if (settings.align === 'right') {
                doc.link(x - textWidth, y - height, textWidth, height, { url: settings.link });
            }
            doc.setTextColor(0, 0, 255);
            doc.setDrawColor(0, 0, 255);
            if (settings.align === 'left') {
                doc.line(x, y + 1, x + textWidth, y + 1);
            } else if (settings.align === 'right') {
                doc.line(x - textWidth, y + 1, x, y + 1);
            }
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
        }
        return y + (lines.length * (settings.fontSize / 2));
    }

    function addSectionHeading(title, y) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(title.toUpperCase(), margin, y);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        return y + 8;
    }

    let y = margin;
    y = addText(document.getElementById('fullName').value, margin, y, { fontSize: 24, fontStyle: 'bold' });
    y += 2;
    y = addText('Phone: ' + document.getElementById('phone').value, margin, y);
    y = addText('Email: ' + document.getElementById('email').value, margin, y);

    let currentX = margin;
    const links = [
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'github', label: 'Github' },
        { id: 'portfolio', label: 'Portfolio' }
    ];
    let linkY = y;
    links.forEach((link, index) => {
        const value = document.getElementById(link.id).value;
        if (value) {
            doc.setTextColor(0, 0, 255);
            doc.setFontSize(12);
            doc.text(link.label, currentX, linkY);
            const textWidth = doc.getTextWidth(link.label);
            doc.link(currentX, linkY - 4, textWidth, 5, { url: value });
            doc.setDrawColor(0, 0, 255);
            doc.line(currentX, linkY + 1, currentX + textWidth, linkY + 1);
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            currentX += textWidth + 5;
            if (index < links.length - 1 && document.getElementById(links[index + 1].id).value) {
                doc.text('•', currentX, linkY);
                currentX += doc.getTextWidth('•') + 5;
            }
        }
    });
    y = linkY + 5;

    y += 10;
    y = addSectionHeading('PROFESSIONAL SUMMARY', y);
    y = addText(document.getElementById('summary').value, margin, y);

    y += 10;
    y = addSectionHeading('EDUCATION', y);
    const educationEntries = document.querySelectorAll('.education-entry');
    educationEntries.forEach(entry => {
        const inputs = entry.querySelectorAll('input');
        const degreeText = inputs[0].value + (inputs[0].value ? ' (' + inputs[1].value + ')' : '');
        y = addText(degreeText, margin, y, { fontStyle: 'bold' });
        const yearsText = inputs[2].value + ' - ' + inputs[3].value;
        addText(yearsText, margin, y - 5, { align: 'right' });
        y = addText(inputs[1].value, margin, y);
        y = addText('Grade: ' + inputs[4].value, margin, y);
        y += 5;
    });

    if (document.getElementById('jobTitle').value) {
        y += 5;
        y = addSectionHeading('EXPERIENCE', y);
        const jobTitle = document.getElementById('jobTitle').value;
        y = addText(jobTitle, margin, y, { fontStyle: 'bold' });
        const dateRange = document.getElementById('jobStartDate').value + ' - ' + document.getElementById('jobEndDate').value;
        addText(dateRange, margin, y - 5, { align: 'right' });
        y = addText(document.getElementById('company').value, margin, y);
        const description = document.getElementById('jobDescription').value;
        if (description) {
            y = addText('• ' + description, margin, y);
        }
        y += 5;
    }

    y += 5;
    y = addSectionHeading('PROJECTS', y);
    const projectEntries = document.querySelectorAll('.project-entry');
    projectEntries.forEach(entry => {
        const inputs = entry.querySelectorAll('input, textarea');
        y = addText(inputs[0].value, margin, y, { fontStyle: 'bold' });
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        addText(month + ' ' + year, margin, y - 5, { align: 'right' });
        let linkX = margin;
        let linkY = y;
        if (inputs[2].value) {
            doc.setTextColor(0, 0, 255);
            doc.text('( GitHub', linkX, linkY);
            const githubWidth = doc.getTextWidth('( GitHub');
            doc.link(linkX, linkY - 4, githubWidth, 5, { url: inputs[2].value });
            doc.setDrawColor(0, 0, 255);
            doc.line(linkX + 2, linkY + 1, linkX + githubWidth - 1, linkY + 1);
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            linkX += githubWidth;
            doc.text(' )', linkX, linkY);
            linkX += doc.getTextWidth(' )') + 2;
        }
        if (inputs[3].value) {
            doc.setTextColor(0, 0, 255);
            doc.text('( Demo', linkX, linkY);
            const demoWidth = doc.getTextWidth('( Demo');
            doc.link(linkX, linkY - 4, demoWidth, 5, { url: inputs[3].value });
            doc.setDrawColor(0, 0, 255);
            doc.line(linkX + 2, linkY + 1, linkX + demoWidth - 1, linkY + 1);
            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);
            linkX += demoWidth;
            doc.text(' )', linkX, linkY);
        }
        y = linkY + 5;
        if (inputs[1].value) {
            const descLines = inputs[1].value.split('\n');
            descLines.forEach(line => {
                if (line.trim()) {
                    y = addText('Description: ' + line, margin, y);
                }
            });
        }
        y += 5;
    });

    y += 5;
    y = addSectionHeading('CERTIFICATIONS', y);
    const certifications = document.getElementById('certifications').value;
    if (certifications) {
        const certLines = certifications.split('\n');
        certLines.forEach(line => {
            if (line.trim()) {
                y = addText(line, margin, y);
            }
        });
    }

    y += 10;
    y = addSectionHeading('SKILLS', y);
    y = addText('Computer Languages: ', margin, y, { fontStyle: 'bold' });
    let skillsText = '';
    const skillInputs = document.querySelectorAll('.skill-entry input');
    skillInputs.forEach((input, index) => {
        if (input.value.trim()) {
            skillsText += input.value.trim();
            if (index < skillInputs.length - 1) {
                skillsText += ', ';
            }
        }
    });
    const lastY = y - 5;
    addText(skillsText, margin + 50, lastY);

    y += 10;
    y = addSectionHeading('EXTRA-CURRICULAR ACTIVITIES', y);
    const activities = document.getElementById('activities').value;
    if (activities) {
        const actLines = activities.split('\n');
        actLines.forEach(line => {
            if (line.trim()) {
                y = addText('• ' + line, margin, y);
            }
        });
    }

    doc.save(document.getElementById('fullName').value.replace(/\s+/g, '_') + "_Resume.pdf");
});
