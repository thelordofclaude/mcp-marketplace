import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'LORD OF CLAUDE — AI News, MCP Server & Claude Skill Directory',
  description: 'The ultimate marketplace directory for verified MCP servers, Claude skills, and breaking AI news. Search, submit, and deploy cutting-edge Claude AI integrations.',
  keywords: [
    'Lord of Claude',
    'AI News',
    'MCP Server Directory',
    'Model Context Protocol',
    'Claude Skills Marketplace',
    'Anthropic Claude Tools',
    'AI Integration Directory'
  ],
  authors: [{ name: 'LORD OF CLAUDE' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'LORD OF CLAUDE — AI News, MCP Server & Claude Skill Directory',
    description: 'Discover verified MCP servers, Claude skills, and breaking AI news. The comprehensive marketplace for Claude AI power users.',
    url: 'https://mcp-marketplace.vercel.app',
    siteName: 'LORD OF CLAUDE',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LORD OF CLAUDE Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LORD OF CLAUDE — AI News & MCP Directory',
    description: 'Verified MCP servers, Claude skills, and breaking AI news updated daily.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}