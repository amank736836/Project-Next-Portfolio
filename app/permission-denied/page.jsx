export default function PermissionDenied() {
  return (
    <div>
      <h1>Permission Denied</h1>
      <p>You don&apos;t have sufficient permissions to access this resource.</p>
      <p>Please contact your administrator if you believe this is an error.</p>
      <a href="/dashboard">Return to Dashboard</a>
    </div>
  );
}