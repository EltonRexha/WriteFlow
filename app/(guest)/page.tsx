import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Writeflow, write your ideas</h1>
      <Link href="/api/auth/signin">
        <button className="btn btn-primary">Signin</button>
      </Link>
    </div>
  );
}
