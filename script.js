document.getElementById('fetchRepo').addEventListener('click', function() {
    const linkType = document.getElementById('linkTypeSelect').value;
    fetch('https://raw.githubusercontent.com/awesome-selfhosted/awesome-selfhosted/master/README.md')
        .then(response => response.text())
        .then(data => {
            const links = parseLinksFromReadme(data, linkType);
            const randomIndex = Math.floor(Math.random() * links.length);
            const randomRepoUrl = links[randomIndex];
            window.open(randomRepoUrl, '_blank');
        })
        .catch(error => console.error('Error fetching data:', error));
});

function parseLinksFromReadme(markdown, linkType) {
    const lines = markdown.split('\n');
    const links = [];
    let inAnalyticsSection = false;
    let stopParsing = false;
    for (let line of lines) {
        if (line.trim() === '## Software') {
            inAnalyticsSection = false;
        } else if (line.trim() === '### Analytics') {
            inAnalyticsSection = true;
            continue;
        }
        if (line.trim() === '## List of Licenses') {
            stopParsing = true;
            continue;
        }
        if (!inAnalyticsSection || stopParsing) {
            continue;
        }
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (match) {
            match.forEach(link => {
                const urlMatch = link.match(/\(([^)]+)\)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    if (linkType === 'main' && !link.includes('Source Code')) {
                        links.push(url);
                    } else if (linkType === 'source' && link.includes('Source Code')) {
                        links.push(url);
                    }
                }
            });
        }
    }
    return links;
}