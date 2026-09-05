import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function getContentItems(type) {
  const dir = path.join(CONTENT_ROOT, type)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))

  return files.map(filename => {
    const filePath = path.join(dir, filename)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      slug: data.slug || filename.replace('.md', ''),
      ...data,
      excerpt: content.slice(0, 200).replace(/[#*`
]/g, ' ').trim() + '...',
    }
  }).sort((a, b) => (b.stars || 0) - (a.stars || 0))
}

export function getContentItem(type, slug) {
  const dir = path.join(CONTENT_ROOT, type)
  const filePath = path.join(dir, `${slug}.md`)

  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    ...data,
    content,
  }
}

export function getAllSlugs(type) {
  const dir = path.join(CONTENT_ROOT, type)
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => ({ slug: f.replace('.md', '') }))
}
