export default function ErrorPage({ statusCode }) {
  return (
    <div>
      <h1>Error {statusCode}</h1>
      <p>Sorry, something went wrong.</p>
      <a href="/">Return to home</a>
    </div>
  );
}