'use client';

import { useState } from 'react';

export default function ArticleCommentsAndDiscussion({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSignIn = () => {
    // Triggers the existing Sign In button in the header
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const signInBtn = buttons.find(
      (el) => el.textContent.trim().toLowerCase().includes('sign in') || el.getAttribute('href')?.includes('signin')
    );

    if (signInBtn) {
      signInBtn.click();
    }
  };

  const handleAddReply = (commentIndex) => {
    if (!replyText.trim()) return;

    const updated = [...comments];
    if (!updated[commentIndex].replies) {
      updated[commentIndex].replies = [];
    }

    updated[commentIndex].replies.push({
      author: 'You (Member)',
      handle: '@community',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: replyText,
      date: 'Just now'
    });

    setComments(updated);
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <div style={{ marginTop: '32px' }}>
      {/* MEMBER BANNER */}
      <div 
        onClick={handleSignIn}
        style={{
          backgroundColor: '#1d4ed8',
          borderRadius: '12px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#ffffff',
          marginBottom: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)'
        }}
      >
        <div style={{
          backgroundColor: '#ffffff',
          color: '#1d4ed8',
          fontWeight: '900',
          fontSize: '18px',
          padding: '6px 12px',
          borderRadius: '8px'
        }}>
          ⚡
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px' }}>
          Become a Member to join the discussion
        </h2>
      </div>

      {/* COMMENTS CONTAINER */}
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}>
        {/* Comment Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '17px', fontWeight: '800', color: '#1d4ed8', borderBottom: '3px solid #1d4ed8', paddingBottom: '10px' }}>
              All Comments
            </span>
            <button 
              onClick={handleSignIn}
              style={{
                backgroundColor: '#facc15',
                color: '#0f172a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔒 Join the Conversation ›
            </button>
          </div>

          <select style={{
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: '#f1f5f9',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            color: '#475569'
          }}>
            <option>Newest</option>
            <option>Most Clapped</option>
          </select>
        </div>

        {/* Comments List */}
        <div style={{ padding: '20px' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
              No comments yet. Click "Join the Conversation" to be the first to reply!
            </p>
          ) : (
            comments.map((comment, idx) => (
              <div key={idx} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <img src={comment.avatar} alt={comment.author} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{comment.author}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{comment.handle}</div>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: '#334155', margin: '6px 0 10px 0', lineHeight: '1.5' }}>
                  {comment.text}
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>👏 {comment.claps || 0} claps</span>
                  <button 
                    onClick={() => setReplyingTo(replyingTo === idx ? null : idx)}
                    style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    Reply
                  </button>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginLeft: '28px', marginTop: '12px', borderLeft: '2px solid #e2e8f0', paddingLeft: '12px' }}>
                    {comment.replies.map((reply, rIdx) => (
                      <div key={rIdx} style={{ marginBottom: '10px' }}>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>{reply.author}</div>
                        <p style={{ fontSize: '13px', color: '#475569', margin: '2px 0' }}>{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === idx && (
                  <div style={{ marginTop: '12px', marginLeft: '28px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px'
                      }}
                    />
                    <button
                      onClick={() => handleAddReply(idx)}
                      style={{
                        backgroundColor: '#1d4ed8',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
