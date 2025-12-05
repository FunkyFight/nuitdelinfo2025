import React from 'react'

export default function PlayLanding() {
  return (
    <div style={styles.container}>
      <div style={styles.frame}>
        <h1 style={styles.text}>Préparez-vous !</h1>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  frame: {
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '3rem 4rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
    textAlign: 'center' as const,
  },
}
