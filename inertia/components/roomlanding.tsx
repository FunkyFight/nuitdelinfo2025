import React from 'react'

interface RoomLandingProps {
  roomId: string | null
}

export default function RoomLanding({ roomId }: RoomLandingProps) {
  return (
    <>
      <style>{spinAnimation}</style>
      <div style={styles.container}>
        <div style={styles.frame}>
          {!roomId ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading...</p>
            </div>
          ) : (
            <div style={styles.codeContainer}>
              <h2 style={styles.title}>Type this code to enter the room!</h2>
              <div style={styles.code}>{roomId}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  frame: {
    width: '500px',
    minHeight: '300px',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '3rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280',
    margin: 0,
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  code: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#2563eb',
    letterSpacing: '0.5rem',
    fontFamily: 'monospace',
  },
}
