import { notFound } from 'next/navigation'
import { getContentItem, getAllSlugs } from '../../../lib/content'
import Link from 'next/link'

export async function generateStaticParams() {
  return getAllSlugs('claude-skills')
}

export default function SkillPage({ params }) {
  const skill = getContentItem('claude-skills', params.slug)

  if (!skill) return notFound()

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        {' → '}
        <Link href="/claude-skills/" style={{ color: 'var(--text-secondary)' }}>Claude Skills</Link>
        {' → '}
        <span>{skill.name || skill.title}</span>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
        {skill.title}
      </h1>

      <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
        {skill.meta_description}
      </p>

      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: skill.content?.replace(/\n/g, '<br>') || '' }} />

      <div style={{ marginTop: 40, padding: 20, background: 'var(--surface)', borderRadius: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quick Stats</h3>
        <table style={{ width: '100%', fontSize: 14 }}>
          <tbody>
            <tr><td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>Type</td><td style={{ fontWeight: 600 }}>{skill.skill_type || 'Skill'}</td></tr>
            <tr><td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>Stars</td><td>⭐ {skill.stars?.toLocaleString() || 0}</td></tr>
            <tr><td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>Language</td><td>{skill.language || 'Unknown'}</td></tr>
            <tr><td style={{ color: 'var(--text-muted)', padding: '6px 0' }}>Repository</td><td><a href={skill.github_url} target="_blank" style={{ color: 'var(--accent)' }}>{skill.repo || skill.github_url}</a></td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/claude-skills/" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          ← Back to all Claude Skills
        </Link>
      </div>
    </div>
  )
}
