// Small local web server for the chat page. Runs only on this computer.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { ask } from './agent.js';
import { sendToIntake } from './intake.js';

const PORT = Number(process.env.PORT) || 4010;
const page = new URL('./public/index.html', import.meta.url);
const startPage = new URL('./public/start.html', import.meta.url);

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8` });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      return send(res, 200, await readFile(page, 'utf8'), 'text/html');
    }
    if (req.method === 'GET' && (req.url === '/start' || req.url === '/start.html')) {
      return send(res, 200, await readFile(startPage, 'utf8'), 'text/html');
    }
    if (req.method === 'POST' && req.url === '/api/chat') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const { messages } = JSON.parse(raw || '{}');
      if (!Array.isArray(messages) || !messages.length) {
        return send(res, 400, { error: 'messages are required' });
      }
      const clean = messages
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-20);
      return send(res, 200, await ask(clean));
    }
    if (req.method === 'POST' && req.url === '/api/send-to-intake') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const { message, senderEmail } = JSON.parse(raw || '{}');
      return send(res, 200, await sendToIntake({ message, senderEmail }));
    }
    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err.message);
    send(res, 500, { error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`TravelOrder AI start page:  http://localhost:${PORT}/start`);
  console.log(`TravelOrder Assistant (local copy of the Joule agent): http://localhost:${PORT}`);
});
