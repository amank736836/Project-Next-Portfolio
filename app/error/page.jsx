import Link from "next/link";

export default function ErrorPage({ statusCode }) {
  return (
    <div>
      <h1>Error {statusCode}</h1>
      <p>Sorry, something went wrong.</p>
      <Link href="/">Return to home</Link>
    </div>
  );
}