async function checkRedirect(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    console.log(`=== Redirect Check for ${url} ===`);
    console.log(`Status: ${res.status}`);
    console.log(`Location Header: ${res.headers.get('location')}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

async function run() {
  // Test Development URL
  await checkRedirect('https://amank736836.scalekit.dev/oauth/authorize?response_type=code&client_id=skc_122282740774077734&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&scope=openid%20profile%20email%20offline_access&state=test');
  
  // Test Production URL
  await checkRedirect('https://amank736836.scalekit.com/oauth/authorize?response_type=code&client_id=prd_skc_122282742149874982&redirect_uri=https%3A%2F%2Famank.co.in%2Fapi%2Fauth%2Fcallback&scope=openid%20profile%20email%20offline_access&state=test');
}

run();
