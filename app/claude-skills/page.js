import Link from 'next/link'
import { getContentItems } from '../../lib/content'

export default function SkillsPage() {
  const skills = getContentItems('claude-skills')

  const types = {}
  skills.forEach(s => {
    const t = s.skill_type || 'skills'
    if (!types[t]) types[t] = []
    types[t].push(s)
  })

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          📚 Claude Skills
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          {skills.length} curated skills, rules, prompts, and workflows for Claude Code and Cursor.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        <span className="btn btn-primary" style={{ fontSize: 13 }}>
          All ({skills.length})
        </span>
        {Object.entries(types).map(([t, items]) => (
          <span key={t} className="btn btn-outline" style={{ fontSize: 13 }}>
            {t.charAt(0).toUpperCase() + t.slice(1)} ({items.length})
          </span>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {skills.slice(0, 50).map(skill => (
          <Link
            key={skill.slug}
            href={`/claude-skill/${skill.slug}/`}
            className="card"
            style={{ display: 'block', padding: 20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                📚
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent-orange)', fontWeight: 600 }}>
                ⭐ {skill.stars?.toLocaleString() || 0}
              </span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{skill.name || skill.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              {skill.meta_description?.slice(0, 100)}...
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>🟩 {skill.language || 'Unknown'}</span>
              <span>🏷️ {skill.skill_type || 'Skill'}</span>
            </div>
          </Link>
        ))}
      </div>

      {skills.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 18, marginBottom: 12 }}>📭 No skills published yet</p>
          <p>The auto-publisher runs every Monday. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
