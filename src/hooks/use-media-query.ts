"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [mounted, setMounted] = useState(false)
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const media = window.matchMedia(query)
    setMatches(media.matches)

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [query])

  // Return null on the server, and actual value on the client
  if (!mounted) return null

  return matches
} 