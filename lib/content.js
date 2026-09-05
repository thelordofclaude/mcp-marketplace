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

      return {
        slug: data.slug || filename.replace('.md', ''),
        ...data,
        excerpt: content.slice(0, 200).replace(/[#*`\n\r]/g, ' ').trim() + '...',
      }
    })
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
}

export function getContentBySlug(type, slug) {
  const items = getContentByType(type)
  return items.find((item) => item.slug === slug) || null
}
