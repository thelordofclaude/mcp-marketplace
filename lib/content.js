import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export function getAllSlugs(type) {
  const dir = path.join(contentDirectory, type)
  if (!fs.existsSync(dir)) return []
  
  const files = fs.readdirSync(dir)
  return files
    .filter((file) => file.endsWith('.md') && file !== 'default.md')
    .map((file) => file.replace(/\.md$/, ''))
}

export function getContentItem(type, slug) {
  if (!slug || slug === 'default') return null

  const fullPath = path.join(contentDirectory, type, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data?.title || slug.replace(/-/g, ' '),
      published_at: data?.published_at || 'Recently',
      category: data?.category || 'AI & Technology',
      ...data,
      content,
    }
  } catch (error) {
    console.error(`Error parsing frontmatter for ${slug}:`, error)
    return null
  }
}

export function getAllItems(type) {
  const slugs = getAllSlugs(type)
  const items = slugs
    .map((slug) => getContentItem(type, slug))
    .filter(Boolean)

  return items
}
