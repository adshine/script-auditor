import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    function onChange(e: MediaQueryListEvent) {
      setValue(e.matches)
    }

    const result = window.matchMedia(query)
    setValue(result.matches)

    result.addEventListener("change", onChange)
    return () => result.removeEventListener("change", onChange)
  }, [query])

  // Return false on the server, actual value on the client
  if (!mounted) return false
  return value
} 