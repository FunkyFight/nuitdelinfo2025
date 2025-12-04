import React from 'react'

interface RoomFooterProps {
  onNext?: () => void
}

export default function RoomFooter({ onNext }: RoomFooterProps) {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <button onClick={onNext} style={styles.button}>
          Next
        </button>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}
