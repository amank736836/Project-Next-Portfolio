import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { portfolio } from '@/data';
import Link from 'next/link';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  // Protect the route
  if (!session) {
    redirect('/api/auth/login');
  }

  return (
    <main className="section container">
      <h2 className="section__title">Admin <span>Portal</span></h2>
      
      <div className="admin__dashboard" style={{ padding: '20px', background: 'var(--container-color)', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3>Project Management</h3>
          <Link href="/api/auth/logout" className="button" style={{ padding: '10px 20px' }}>Logout</Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '10px' }}>Project Name</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((project) => (
              <tr key={project.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px' }}>{project.title}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ color: 'green' }}>Visible</span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button className="button" style={{ padding: '5px 15px', fontSize: '12px' }}>Hide</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '40px' }}>
          <h3>Add New Project</h3>
          <p>Coming Soon: Integration with Firestore for full CRUD.</p>
        </div>
      </div>
    </main>
  );
}
