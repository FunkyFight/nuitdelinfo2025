import { usePage } from "@inertiajs/react";
import { useState } from "react"

interface PageProps {
  room_id: string | number,
  [key: string]: any
}

export default function Home() {
  const [debug, setDebug] = useState<string>();
  const { room_id } = usePage<PageProps>().props


  return (
    <>
      <p>{room_id}</p>
    </>
  )
}
