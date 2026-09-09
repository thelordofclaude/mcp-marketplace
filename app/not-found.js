import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2>404 - Page Not Found</h2>
      <p style={{ margin: '16px 0', color: '#6b7280' }}>The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
        Return Home
      </Link>
    </div>
  )
}
