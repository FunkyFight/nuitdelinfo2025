import { Head, Link } from '@inertiajs/react'

const input_styles: React.CSSProperties = {
  borderWidth: 2,
  borderRadius: "25px",
  margin: "5px",
  padding: "10px 25px",
  width: "100%",
  maxWidth: "350px",
}

export default function Home() {
  return (
    <>
      <Head title="Homepage" />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          marginBottom: "20px"
        }}>Bienvenue sur Caroot !</h1>
        <Link href={"/join"}>
          <button type="submit" style={input_styles}>Rejoindre la salle</button>
        </Link>
        <Link href={"/room"}>
          <button type="submit" style={input_styles}>Créer une nouvelle salle de jeu</button>
        </Link>
        
      </div>
    </>
  )
}