async function run() {
  const url = 'https://amank736836.scalekit.com/oauth/authorize?response_type=code&client_id=prd_skc_122282742149874982&redirect_uri=https%3A%2F%2Famank.co.in%2Fapi%2Fauth%2Fcallback&scope=openid%20profile%20email%20offline_access&state=test';
  
  try {
    const res = await fetch(url);
    const html = await res.text();
    console.log('Status:', res.status);
    console.log('HTML Length:', html.length);
    
    // Search for Google OAuth links in the HTML
    const googleMatches = html.match(/https:\/\/accounts\.google\.com\/o\/oauth2[^\s"']+/g);
    if (googleMatches) {
      console.log('Found Google Auth Links:');
      googleMatches.forEach((link, i) => {
        console.log(`Link ${i + 1}:`, decodeURIComponent(link));
      });
    } else {
      console.log('No direct Google OAuth links found in HTML.');
      // Let's search for any other links or script bundles
      const matches = html.match(/href="([^"]+)"/g);
      console.log('Sample href links (first 5):', matches ? matches.slice(0, 5) : 'none');
    }
  } catch (err) {
    console.error('Error fetching authorize page:', err);
  }
}

run();
