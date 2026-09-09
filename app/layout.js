import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'

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
      <head>
        {/* Load Supabase JS Client library */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" 
          strategy="beforeInteractive" 
        />
        {/* Initialize Supabase and global authentication helpers */}
        <Script id="supabase-init" strategy="afterInteractive">
          {`
            const SUPABASE_URL = "https://mdcftnxmrbulxildgtgc.supabase.co/rest/v1/";
            const SUPABASE_ANON_KEY = "sb_publishable_wwSmEishoqs6ELcNJj33Vg_FyPXonQ7";
            
            if (window.supabase) {
              window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }

            window.openAuthModal = function() {
              const modal = document.getElementById('globalAuthModal');
              if (modal) modal.style.display = 'flex';
            };

            window.closeAuthModal = function() {
              const modal = document.getElementById('globalAuthModal');
              if (modal) modal.style.display = 'none';
            };

            window.handleAuthSubmit = async function(e) {
              e.preventDefault();
              const email = document.getElementById('authEmail').value;
              const password = document.getElementById('authPassword').value;
              const name = document.getElementById('authName').value;

              if (!window.supabaseClient) {
                alert('Supabase client not loaded yet. Please wait a second and try again.');
                return;
              }

              let { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: name } }
              });

              if (error && error.message.includes("already registered")) {
                const res = await window.supabaseClient.auth.signInWithPassword({ email, password });
                data = res.data;
                error = res.error;
              }

              if (error) {
                alert(error.message);
              } else {
                alert('Success! You are now signed in.');
                window.closeAuthModal();
                location.reload();
              }
            };
          `}
        </Script>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />

        {/* GLOBAL AUTHENTICATION MODAL */}
        <div id="globalAuthModal" style={{ display: 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 99999, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '90%', maxWidth: '400px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', fontFamily: 'sans-serif' }}>
            <button onClick={() => window.closeAuthModal()} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            
            <h3 style={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', color: '#111827', marginTop: 0, marginBottom: '8px' }}>Sign in to join discussion</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' }}>Enter your credentials to comment and save preferences.</p>

            <form onSubmit={(e) => window.handleAuthSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" id="authName" placeholder="Full Name" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
              <input type="email" id="authEmail" placeholder="Email Address" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
              <input type="password" id="authPassword" placeholder="Password" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
              
              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', padding: '11px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '4px', fontSize: '14px' }}>Sign In / Register</button>
            </form>
          </div>
        </div>
      </body>
    </html>
  )
}
