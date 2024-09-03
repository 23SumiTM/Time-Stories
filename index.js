import http from "http";
import https from "https";

const PORT = 5555;
const TIME_URL = 'https://time.com';

const server = http.createServer((req, res) => {
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        https.get(TIME_URL, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const stories = extractStories(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(stories));
            });
        }).on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching data');
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

function extractStories(html) {
    const stories = [];
    const startMarker = '<li class="latest-stories__item">';
    const endMarker = '</li>';
    const linkMarker = 'href="';
    const titleMarker = '">';
    
    let startIndex = 0;

    while (stories.length < 6) {
    
        startIndex = html.indexOf(startMarker, startIndex);
        if (startIndex === -1) break;

           
           const linkStart = html.indexOf(linkMarker, startIndex) + linkMarker.length;
           const linkEnd = html.indexOf('"', linkStart);
           const link = TIME_URL + html.slice(linkStart, linkEnd);

        const titleStart = html.indexOf(titleMarker, linkEnd) + titleMarker.length;
        const titleEnd = html.indexOf('</a>', titleStart);
        const title = html.slice(titleStart, titleEnd).trim();

        stories.push({ title, link });

        startIndex = linkEnd;
    }

    return stories;
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/getTimeStories`);
});
