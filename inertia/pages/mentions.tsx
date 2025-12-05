import { Head } from '@inertiajs/react'

export default function Mentions() {
  return (
    <>
      <Head title="Mentions Légales" />
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>Mentions Légales</h1>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Équipe</h2>
            <p style={styles.text}>
              <strong>Nuit de l'Info 2025 - Équipe "Dernière Minute"</strong>
            </p>
            <p style={styles.text}>
              Auteurs du site :
            </p>
            <ul style={styles.list}>
              <li style={styles.text}>Bergerault--Rotureau Théo</li>
              <li style={styles.text}>Moreau Subertat Antonin</li>
              <li style={styles.text}>Aumont--Vesnier Aurèle</li>
              <li style={styles.text}>Maggi Théo</li>
              <li style={styles.text}>Deschamps Alexis</li>
              <li style={styles.text}>Makaroff Valentin</li>
              <li style={styles.text}>Blaquart Romain</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Hébergement</h2>
            <p style={styles.text}>
              Ce site est hébergé par :
            </p>
            <p style={styles.text}>
              <strong>OVH</strong><br />
              2 rue Kellermann<br />
              59100 Roubaix<br />
              France
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Crédits</h2>
            <p style={styles.text}>
              Modèle 3D de PC portable :<br />
              <strong>MosaicManufacturing</strong><br />
              <a 
                href="https://cults3d.com/en/orders/143973514" 
                style={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                https://cults3d.com/en/orders/143973514
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '3rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: '1.6',
    margin: '0.5rem 0',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    wordBreak: 'break-all' as const,
  },
  list: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    margin: '0.5rem 0',
  },
}
