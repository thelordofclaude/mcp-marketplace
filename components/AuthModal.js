'use client'

import { useState } from 'react'

export default function AuthModal() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleAuthSubmit = async (e) => {
    e.preventDefault()

    if (typeof window === 'undefined' || !window.supabaseClient) {
      alert('Supabase client not loaded yet. Please try again.')
      return
    }

    let { data, error } = await window.supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error && error.message.includes("already registered")) {
      const res = await window.supabaseClient.auth.signInWithPassword({ email, password })
      data = res.data
      error = res.error
    }

    if (error) {
      alert(error.message)
    } else {
      alert('Success! You are now signed in.')
      if (window.closeAuthModal) window.closeAuthModal()
      window.location.reload()
    }
  }

  return (
    <div id="globalAuthModal" style={{ display: 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 99999, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '90%', maxWidth: '400px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', fontFamily: 'sans-serif' }}>
        <button onClick={() => window.closeAuthModal && window.closeAuthModal()} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        
        <h3 style={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', color: '#111827', marginTop: 0, marginBottom: '8px' }}>Sign in to join discussion</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' }}>Enter your credentials to comment and save preferences.</p>

        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', boxSizing: 'border-box', color: '#111827', backgroundColor: '#ffffff' }} />
          
          <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', padding: '11px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '4px', fontSize: '14px' }}>Sign In / Register</button>
        </form>
      </div>
    </div>
  )
}
