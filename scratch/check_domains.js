async function checkUrl(url) {
  try {
    const res = await fetch(url);
    console.log(`${url} -> Status: ${res.status}`);
  } catch (err) {
    console.log(`${url} -> Error: ${err.message}`);
  }
}

async function run() {
  await checkUrl('https://amank736836.scalekit.dev');
  await checkUrl('https://amank736836.scalekit.com');
  await checkUrl('https://scalekit-2lwaygqaaqeq.scalekit.dev');
}

run();
