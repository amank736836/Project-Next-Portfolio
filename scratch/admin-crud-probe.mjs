/**
 * Scratch: exercise every admin API route against the offline data layer.
 * Crafts a valid session cookie (the session cookie is plain JSON, unsigned)
 * for the authorized admin email and drives the CRUD endpoints.
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const EMAIL = 'amankarguwal0@gmail.com';

const session = {
  user: { sub: 'probe-user', email: EMAIL, name: 'Probe Admin' },
  tokens: {
    access_token: 'probe-access',
    refresh_token: 'probe-refresh',
    id_token: 'probe-id',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
  },
  roles: [],
  permissions: [],
};

const COOKIE = `scalekit_session=${encodeURIComponent(JSON.stringify(session))}`;

let pass = 0;
let fail = 0;

function check(name, cond, info = '') {
  if (cond) { pass++; console.log(`PASS  ${name} ${info}`); }
  else { fail++; console.log(`FAIL  ${name} ${info}`); }
}

async function req(method, path, body, extraHeaders = {}) {
  const headers = {
    cookie: COOKIE,
    origin: BASE,
    'content-type': 'application/json',
    ...extraHeaders,
  };
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  // ---------- skills ----------
  let r = await req('GET', '/api/admin/skills');
  check('GET /api/admin/skills', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);
  const skillCount = Array.isArray(r.json) ? r.json.length : 0;

  r = await req('POST', '/api/admin/skills', { title: 'ProbeSkill', percentage: 50, category: 'Frontend' });
  check('POST /api/admin/skills', r.status === 200 && r.json?.title === 'ProbeSkill', `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);
  const skillId = r.json?.id;

  r = await req('POST', '/api/admin/skills', { percentage: 10 });
  check('POST /api/admin/skills (no title -> 400)', r.status === 400, `-> ${r.status}`);

  r = await req('PUT', '/api/admin/skills', { id: skillId, percentage: 77 });
  check('PUT /api/admin/skills', r.status === 200 && r.json?.percentage === 77, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);

  r = await req('PUT', '/api/admin/skills', { percentage: 5 });
  check('PUT /api/admin/skills (no id -> 400)', r.status === 400, `-> ${r.status}`);

  r = await req('PATCH', '/api/admin/skills?id=' + skillId, { is_hidden: true });
  check('PATCH /api/admin/skills (hide)', r.status === 200, `-> ${r.status}`);

  r = await req('GET', '/api/admin/skills');
  const hiddenSkill = r.json?.find?.((s) => s.id === skillId);
  check('hidden flag persisted', hiddenSkill?.is_hidden === true, JSON.stringify(hiddenSkill));

  // public skills endpoint must NOT include hidden skill
  r = await req('GET', '/api/info'); // sanity public
  let pub = await fetch(BASE + '/api/projects');
  check('GET /api/projects public', pub.status === 200, `-> ${pub.status}`);

  r = await req('DELETE', '/api/admin/skills?id=' + skillId);
  check('DELETE /api/admin/skills', r.status === 200, `-> ${r.status}`);

  r = await req('GET', '/api/admin/skills');
  check('skill deleted', !r.json?.some?.((s) => s.id === skillId), `count=${r.json?.length} (was ${skillCount})`);

  // ---------- skill categories ----------
  r = await req('GET', '/api/admin/skill-categories');
  check('GET /api/admin/skill-categories', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

  r = await req('POST', '/api/admin/skill-categories', { name: 'ProbeCat' });
  check('POST /api/admin/skill-categories', r.status === 200 && r.json?.name === 'ProbeCat', `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);
  const catId = r.json?.id;

  r = await req('POST', '/api/admin/skill-categories', { name: 'ProbeCat' });
  check('POST duplicate category -> 409', r.status === 409, `-> ${r.status}`);

  r = await req('PUT', '/api/admin/skill-categories', { id: catId, display_order: 99 });
  check('PUT /api/admin/skill-categories (reorder)', r.status === 200, `-> ${r.status}`);

  r = await req('DELETE', '/api/admin/skill-categories?id=1');
  check('DELETE default category -> 403', r.status === 403, `-> ${r.status}`);

  r = await req('DELETE', '/api/admin/skill-categories?id=' + catId);
  check('DELETE /api/admin/skill-categories', r.status === 200, `-> ${r.status}`);

  // ---------- projects ----------
  r = await req('GET', '/api/admin/projects');
  check('GET /api/admin/projects', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

  r = await req('POST', '/api/admin/projects', { title: 'ProbeProj', img: '/assets/ciphergen.png', category: 'Frontend', details: [{ title: 'Github : ', desc: 'https://github.com/x' }, { title: 'Preview : ', desc: 'https://x.com' }, { title: 'Language : ', desc: 'React' }] });
  check('POST /api/admin/projects', r.status === 200 && r.json?.title === 'ProbeProj', `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 160)}`);
  const projId = r.json?.id;
  check('new project defaults to hidden', r.json?.is_hidden === true, `is_hidden=${r.json?.is_hidden}`);

  r = await req('PUT', '/api/admin/projects', { id: projId, is_hidden: false });
  check('PUT /api/admin/projects (publish)', r.status === 200 && r.json?.is_hidden === false, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 160)}`);

  // public projects filter requires title+img+details(github/preview/language)
  pub = await fetch(BASE + '/api/projects');
  const pubProjects = await pub.json();
  check('published project appears in /api/projects', Array.isArray(pubProjects) && pubProjects.some((p) => p.id === projId), `count=${pubProjects?.length}`);

  r = await req('PUT', '/api/admin/projects', { id: projId, title: '', is_hidden: false });
  check('PUT project with empty title', r.status === 200, `-> ${r.status}`);
  pub = await fetch(BASE + '/api/projects');
  const pubProjects2 = await pub.json();
  check('empty-title project filtered from public', !pubProjects2.some((p) => p.id === projId), '');

  r = await req('DELETE', '/api/admin/projects?id=' + projId);
  check('DELETE /api/admin/projects', r.status === 200, `-> ${r.status}`);

  // ---------- info (personal_info) ----------
  r = await req('GET', '/api/admin/info');
  check('GET /api/admin/info', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

  r = await req('POST', '/api/admin/info', { key: 'probe_key', title: 'Probe', description: 'probe value' });
  check('POST /api/admin/info', r.status === 200 && r.json?.key === 'probe_key', `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);

  r = await req('PUT', '/api/admin/info', [{ key: 'probe_key', title: 'Probe', description: 'updated', is_hidden: false }]);
  check('PUT /api/admin/info (upsert array)', r.status === 200, `-> ${r.status}`);

  r = await req('PATCH', '/api/admin/info?key=probe_key', { is_hidden: true });
  check('PATCH /api/admin/info (hide)', r.status === 200, `-> ${r.status}`);

  r = await req('DELETE', '/api/admin/info?key=probe_key');
  check('DELETE /api/admin/info', r.status === 200, `-> ${r.status}`);

  // ---------- settings ----------
  r = await req('GET', '/api/admin/settings');
  check('GET /api/admin/settings', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

  r = await req('POST', '/api/admin/settings', { key: 'probe_setting', title: 'Probe Setting', description: 'true', type: 'boolean' });
  check('POST /api/admin/settings', r.status === 200, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);

  r = await req('PUT', '/api/admin/settings', [{ key: 'probe_setting', title: 'Probe Setting', description: 'false', type: 'boolean' }]);
  check('PUT /api/admin/settings', r.status === 200, `-> ${r.status}`);

  r = await req('DELETE', '/api/admin/settings?key=probe_setting');
  check('DELETE /api/admin/settings', r.status === 200, `-> ${r.status}`);

  // ---------- social links ----------
  r = await req('GET', '/api/admin/social-links');
  check('GET /api/admin/social-links', r.status === 200 && Array.isArray(r.json?.data), `-> ${r.status}`);

  // Unique platform per run: social_links.platform has a UNIQUE constraint
  // (enforced by Postgres and by the offline client since BUG-012).
  const probePlatform = `probe_net_${Date.now()}`;
  r = await req('POST', '/api/admin/social-links', { platform: probePlatform, url: 'https://example.com/probe' });
  check('POST /api/admin/social-links', r.status === 201 && r.json?.data?.platform === probePlatform, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 140)}`);
  const linkId = r.json?.data?.id;

  r = await req('POST', '/api/admin/social-links', { platform: '' });
  check('POST /api/admin/social-links (missing url -> 400)', r.status === 400, `-> ${r.status}`);

  r = await req('PATCH', '/api/admin/social-links/' + linkId, { is_hidden: true });
  check('PATCH /api/admin/social-links/[id]', r.status === 200 && r.json?.data?.is_hidden === true, `-> ${r.status}`);

  r = await req('GET', '/api/admin/social-links');
  // BUG-013 fix: the admin list shows ALL links, including hidden ones.
  check('hidden link IS listed by admin GET', r.json?.data?.some?.((s) => s.id === linkId) === true, '');

  r = await req('DELETE', '/api/admin/social-links/' + linkId);
  check('DELETE /api/admin/social-links/[id]', r.status === 200, `-> ${r.status}`);

  // ---------- hero images ----------
  r = await req('GET', '/api/admin/hero-images');
  check('GET /api/admin/hero-images', r.status === 200 && Array.isArray(r.json?.data), `-> ${r.status}`);

  // ---------- resumes ----------
  r = await req('GET', '/api/admin/resumes');
  check('GET /api/admin/resumes', r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

  if (Array.isArray(r.json) && r.json.length) {
    const rid = r.json[0].id;
    r = await req('PUT', '/api/admin/resumes', { id: rid, is_favorite: true });
    check('PUT /api/admin/resumes (favorite)', r.status === 200 && r.json?.is_favorite === true, `-> ${r.status}`);
    r = await req('PUT', '/api/admin/resumes', { id: rid });
    check('PUT /api/admin/resumes (no updates -> 400)', r.status === 400, `-> ${r.status}`);
    r = await req('PUT', '/api/admin/resumes', { id: rid, is_favorite: false });
    check('PUT /api/admin/resumes (unfavorite)', r.status === 200 && r.json?.is_favorite === false, `-> ${r.status}`);
  }

  // ---------- api logs ----------
  r = await req('GET', '/api/admin/api-logs?page=1&limit=10');
  check('GET /api/admin/api-logs', r.status === 200 && Array.isArray(r.json?.data) && r.json?.pagination, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 140)}`);

  r = await req('POST', '/api/admin/api-logs', { endpoint: '/probe', method: 'GET', status_code: 200 });
  check('POST /api/admin/api-logs', r.status === 201, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 140)}`);

  r = await req('POST', '/api/admin/api-logs', { method: 'GET' });
  check('POST /api/admin/api-logs (missing endpoint -> 400)', r.status === 400, `-> ${r.status}`);

  // ---------- csp reports ----------
  r = await req('GET', '/api/admin/csp-reports?page=1&limit=10');
  check('GET /api/admin/csp-reports', r.status === 200 && Array.isArray(r.json?.data), `-> ${r.status}`);

  // ---------- education / experience ----------
  for (const t of ['education', 'experience']) {
    r = await req('GET', `/api/admin/${t}`);
    check(`GET /api/admin/${t}`, r.status === 200 && Array.isArray(r.json), `-> ${r.status}`);

    r = await req('POST', `/api/admin/${t}`, { year: '2020 - 2021', title: 'Probe Entry', description: 'probe', category: 'education' });
    check(`POST /api/admin/${t}`, r.status === 200 && r.json?.title === 'Probe Entry', `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 120)}`);
    const entryId = r.json?.id;

    r = await req('PUT', `/api/admin/${t}`, { id: entryId, is_hidden: true });
    check(`PUT /api/admin/${t} (hide)`, r.status === 200, `-> ${r.status}`);

    r = await req('DELETE', `/api/admin/${t}`, { id: entryId });
    check(`DELETE /api/admin/${t}`, r.status === 200, `-> ${r.status}`);
  }

  // ---------- auth:validate with session ----------
  r = await req('GET', '/api/auth/validate');
  check('GET /api/auth/validate (authed)', r.status === 200 && r.json?.authenticated === true, `-> ${r.status} ${JSON.stringify(r.json)?.slice(0, 140)}`);

  // ---------- unauthorized access ----------
  const noAuth = await fetch(BASE + '/api/admin/skills');
  check('GET /api/admin/skills without session -> 401', noAuth.status === 401, `-> ${noAuth.status}`);

  const wrongEmail = { ...session, user: { ...session.user, email: 'intruder@example.com' } };
  const bad = await fetch(BASE + '/api/admin/skills', { headers: { cookie: `scalekit_session=${encodeURIComponent(JSON.stringify(wrongEmail))}` } });
  check('GET /api/admin/skills wrong email -> 403', bad.status === 403, `-> ${bad.status}`);

  // CSRF: cross-origin POST to admin API
  const csrf = await fetch(BASE + '/api/admin/skills', {
    method: 'POST',
    headers: { cookie: COOKIE, 'content-type': 'application/json', origin: 'https://evil.example.com' },
    body: JSON.stringify({ title: 'Evil' }),
  });
  check('cross-origin POST /api/admin/skills -> 403', csrf.status === 403, `-> ${csrf.status}`);

  console.log(`\n[probe] pass=${pass} fail=${fail}`);
  process.exitCode = fail ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
