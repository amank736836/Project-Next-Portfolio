
const fetch = require('node-fetch');

async function checkApi(path) {
  try {
    const res = await fetch(`http://localhost:3000/api/admin/${path}`);
    const data = await res.json();
    console.log(`Path: ${path} | Status: ${res.status}`);
    if (res.status !== 200) console.log('Error:', data.error);
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
  }
}

async function run() {
  await checkApi('info');
  await checkApi('projects');
  await checkApi('skills');
}

run();
