async function fetchOidcConfig(url) {
  try {
    const res = await fetch(`${url}/.well-known/openid-configuration`);
    if (res.ok) {
      const data = await res.json();
      console.log(`=== OIDC Config for ${url} ===`);
      console.log(`Issuer: ${data.issuer}`);
      console.log(`Authorization Endpoint: ${data.authorization_endpoint}`);
      console.log(`Token Endpoint: ${data.token_endpoint}`);
      console.log(`Userinfo Endpoint: ${data.userinfo_endpoint}`);
    } else {
      console.log(`${url} -> Status: ${res.status}`);
    }
  } catch (err) {
    console.log(`${url} -> Error: ${err.message}`);
  }
}

async function run() {
  await fetchOidcConfig('https://amank736836.scalekit.dev');
  await fetchOidcConfig('https://amank736836.scalekit.com');
  await fetchOidcConfig('https://scalekit-2lwaygqaaqeq.scalekit.dev');
}

run();
