import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export function getContentByType(type) {
  const dirPath = path.join(contentDirectory, type)
  if (!fs.existsSync(dirPath)) return []

  const filenames = fs.readdirSync(dirPath)
  return filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(dirPath, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      // Convert Date objects to ISO string dates to avoid serialization errors
      const safeData = { ...data }
      for (const key in safeData) {
        if (safeData[key] instanceof Date) {
          safeData[key] = safeData[key].toISOString().split('T')[0]
        }
      }

      return {
        slug: safeData.slug || filename.replace('.md', ''),
        ...safeData,
        content: content || '',
        excerpt: content ? content.slice(0, 200).replace(/[#*`\n\r]/g, ' ').trim() + '...' : '',
      }
    })
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
}

export function getContentBySlug(type, slug) {
  const items = getContentByType(type)
  return items.find((item) => item.slug === slug) || null
}

export function getContentItems(type) {
  return getContentByType(type)
}

export function getContentItem(type, slug) {
  return getContentBySlug(type, slug)
}

export function getAllSlugs(type) {
  const items = getContentByType(type)
  return items.map((item) => ({ slug: item.slug }))
}
