async function run() {
  const res = await fetch('https://amank.co.in/api/auth/login', {
    redirect: 'manual'
  });
  console.log('Status:', res.status);
  console.log('Headers:', Object.fromEntries(res.headers.entries()));
}

run().catch(console.error);
