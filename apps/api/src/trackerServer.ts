import * as http from 'http';
import { readFileSync } from 'fs';
import * as path from 'path';

const trackerContent = readFileSync(
  path.join(__dirname, '..', '..', 'src', 'tracker.js'),
);

http
  .createServer(function (request, response) {
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:8000',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000, // 30 days
      /** add other headers as per requirement */
    };

    if (request.method === 'OPTIONS') {
      response.writeHead(204, headers);
      response.end();
      return;
    }

    console.log(request.url, request.method);
    if (request.url === '/track' && request.method === 'POST') {
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        ...headers,
      });
      response.end('', 'utf-8');
      return;
    }
    if (request.url === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        ...headers,
      });
      response.end(trackerContent, 'utf-8');
    } else {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end('404', 'utf-8');
    }
  })
  .listen(8001);
