


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Globe } from "lucide-react"

// const languages = [
//   { code: "en", name: "English" },
//   { code: "hi", name: "Hindi" },
//   { code: "mr", name: "Marathi" },
//   { code: "gu", name: "Gujarati" },
//   { code: "bn", name: "Bengali" },
//   { code: "ta", name: "Tamil" },
//   { code: "te", name: "Telugu" },
//   { code: "kn", name: "Kannada" },
//   { code: "ml", name: "Malayalam" },
//   { code: "pa", name: "Punjabi" },
// ]

// export default function LanguageSelector() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [currentLanguage, setCurrentLanguage] = useState("en")
//   const containerRef = useRef<HTMLDivElement>(null)
//   const hasInitialized = useRef(false)

//   const hideGoogleElements = () => {
//     const googleBanner = document.querySelector('.skiptranslate') as HTMLElement
//     if (googleBanner) {
//       googleBanner.style.display = 'none'
//     }
//     document.body.style.top = '0px'
//     const iframes = document.querySelectorAll('iframe')
//     iframes.forEach(iframe => {
//       if (iframe.src.includes('translate.google') || iframe.classList.contains('goog-te-banner-frame')) {
//         iframe.style.display = 'none'
//       }
//     })
//   }

//   useEffect(() => {
//     if (hasInitialized.current) return
//     hasInitialized.current = true

//     const translateDiv = document.createElement("div")
//     translateDiv.id = "google_translate_element"
//     translateDiv.style.position = "absolute"
//     translateDiv.style.top = "-9999px"
//     translateDiv.style.left = "-9999px"
//     document.body.appendChild(translateDiv)

//     const initGoogleTranslate = () => {
//       try {
//         if (window.google && window.google.translate) {
//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: "en",
//               includedLanguages: languages.map(lang => lang.code).join(","),
//               layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//               autoDisplay: false,
//             },
//             "google_translate_element"
//           )
//           setTimeout(hideGoogleElements, 100)
//           setIsLoaded(true)
//         }
//       } catch (error) {
//         console.error("Failed to initialize Google Translate:", error)
//         setError("Failed to initialize translation")
//         setIsLoaded(true)
//       }
//     }

//     window.googleTranslateElementInit = initGoogleTranslate

//     const script = document.createElement("script")
//     script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//     script.async = true
//     script.defer = true
//     script.onerror = () => {
//       setError("Failed to load translation service")
//       setIsLoaded(true)
//     }
//     document.body.appendChild(script)

//     const checkInterval = setInterval(() => {
//       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement
//       if (combo) {
//         clearInterval(checkInterval)
//         setIsLoaded(true)
//         hideGoogleElements()
//       }
//     }, 1000)

//     const style = document.createElement('style')
//     style.textContent = `
//       .goog-te-banner-frame { display: none !important; }
//       .goog-te-menu-value:hover { text-decoration: none !important; }
//       .skiptranslate { display: none !important; }
//       body { top: 0 !important; }
//     `
//     document.head.appendChild(style)

//     const observer = new MutationObserver(() => {
//       hideGoogleElements()
//     })
//     observer.observe(document.body, { childList: true, subtree: true })

//     return () => {
//       clearInterval(checkInterval)
//       observer.disconnect()
//       if (translateDiv && document.body.contains(translateDiv)) document.body.removeChild(translateDiv)
//       if (script && document.body.contains(script)) document.body.removeChild(script)
//       if (style && document.head.contains(style)) document.head.removeChild(style)
//       if ((window as any).googleTranslateElementInit) {
//         (window as any).googleTranslateElementInit = undefined
//       }
//     }
//   }, [])

//   const changeLanguage = (languageCode: string) => {
//     if (!isLoaded) return
//     try {
//       const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement
//       if (combo) {
//         combo.value = languageCode
//         combo.dispatchEvent(new Event("change"))
//         setCurrentLanguage(languageCode)
//         setTimeout(hideGoogleElements, 300)
//       } else {
//         document.cookie = `googtrans=/en/${languageCode}; path=/; domain=${window.location.hostname}`
//         const hostnameParts = window.location.hostname.split('.')
//         if (hostnameParts.length > 1) {
//           const mainDomain = hostnameParts.slice(hostnameParts.length - 2).join('.')
//           document.cookie = `googtrans=/en/${languageCode}; path=/; domain=.${mainDomain}`
//         }
//         window.location.reload()
//       }
//       setIsOpen(false)
//     } catch (err) {
//       console.error("Error changing language:", err)
//       setError("Failed to change language. Please try again.")
//     }
//   }

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   return (
//     <div className="fixed bottom-4 left-4 z-50" ref={containerRef}>
//       {isOpen && (
//         <div className="absolute bottom-full mb-2 left-0 w-48 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//           {!isLoaded && (
//             <p className="text-center py-2 text-sm text-gray-700">Loading languages...</p>
//           )}
//           {error && (
//             <p className="text-center py-2 text-sm text-red-500">{error}</p>
//           )}
//           {isLoaded && !error && languages.map((lang) => (
//             <button
//               key={lang.code}
//               onClick={() => changeLanguage(lang.code)}
//               className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${currentLanguage === lang.code ? "font-medium bg-gray-50" : ""
//                 }`}
//             >
//               {lang.name}
//             </button>
//           ))}
//         </div>
//       )}

//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//         aria-label="Change language"
//       >
//         <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
//       </button>

//       <div id="google_translate_element" className="hidden" />
//     </div>
//   )
// }

// declare global {
//   interface Window {
//     googleTranslateElementInit: () => void
//     google: any
//   }
// }



"use client"

import { useState, useEffect, useRef } from "react"
import { Globe } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
]

// ─── Cookie helpers ────────────────────────────────────────────────────────────

function getCurrentLangFromCookie(): string {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/)
  if (!match) return "en"
  const parts = decodeURIComponent(match[1]).split("/")
  const lang = parts[parts.length - 1]
  return lang && lang !== "en" ? lang : "en"
}

function clearGoogTransCookie() {
  const expired = "; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  const hostname = window.location.hostname
  document.cookie = `googtrans=; path=/${expired}`
  document.cookie = `googtrans=; path=/; domain=${hostname}${expired}`
  const parts = hostname.split(".")
  if (parts.length > 1) {
    document.cookie = `googtrans=; path=/; domain=.${parts.slice(-2).join(".")}${expired}`
  }
}

function setGoogTransCookie(langCode: string) {
  const value = `/en/${langCode}`
  const hostname = window.location.hostname
  document.cookie = `googtrans=${value}; path=/`
  document.cookie = `googtrans=${value}; path=/; domain=${hostname}`
  const parts = hostname.split(".")
  if (parts.length > 1) {
    document.cookie = `googtrans=${value}; path=/; domain=.${parts.slice(-2).join(".")}`
  }
}

// ─── Suppress Google's injected UI chrome ─────────────────────────────────────

function hideGoogleElements() {
  const banner = document.querySelector(".skiptranslate") as HTMLElement | null
  if (banner) banner.style.display = "none"
  document.body.style.top = "0px"
  document.querySelectorAll<HTMLIFrameElement>("iframe").forEach((f) => {
    if (
      f.src.includes("translate.google") ||
      f.classList.contains("goog-te-banner-frame")
    ) {
      f.style.display = "none"
    }
  })
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Read from cookie on mount so button always reflects the real active language
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const containerRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    setCurrentLanguage(getCurrentLangFromCookie())
  }, [])

  // ── Bootstrap hidden Google Translate widget ────────────────────────────────
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const translateDiv = document.createElement("div")
    translateDiv.id = "google_translate_element"
    translateDiv.style.cssText = "position:absolute;top:-9999px;left:-9999px"
    document.body.appendChild(translateDiv)

    const style = document.createElement("style")
    style.textContent = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-menu-value:hover { text-decoration: none !important; }
      .skiptranslate { display: none !important; }
      body { top: 0 !important; }
    `
    document.head.appendChild(style)

    const observer = new MutationObserver(hideGoogleElements)
    observer.observe(document.body, { childList: true, subtree: true })

    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: languages.map((l) => l.code).join(","),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          )
          setTimeout(hideGoogleElements, 100)
          setIsLoaded(true)
        }
      } catch (err) {
        console.error("Failed to initialize Google Translate:", err)
        setError("Failed to initialize translation")
        setIsLoaded(true)
      }
    }

    const script = document.createElement("script")
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    script.defer = true
    script.onerror = () => {
      setError("Failed to load translation service")
      setIsLoaded(true)
    }
    document.body.appendChild(script)

    const poll = setInterval(() => {
      if (document.querySelector(".goog-te-combo")) {
        clearInterval(poll)
        hideGoogleElements()
        setIsLoaded(true)
      }
    }, 800)

    return () => {
      clearInterval(poll)
      observer.disconnect()
      if (document.body.contains(translateDiv)) document.body.removeChild(translateDiv)
      if (document.body.contains(script)) document.body.removeChild(script)
      if (document.head.contains(style)) document.head.removeChild(style)
      delete (window as any).googleTranslateElementInit
    }
  }, [])

  // ── Close on outside click ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Language switch — always cookie + reload ────────────────────────────────
  // FIX: Never use .goog-te-combo manipulation. In production the combo element
  // exists but dispatchEvent("change") silently fails. Cookie + reload is the
  // only approach that works reliably across every environment.
  // For English, DELETE the cookie (don't set /en/en) — that's what actually
  // tells Google Translate to restore the original page.
  const changeLanguage = (langCode: string) => {
    if (langCode === currentLanguage) {
      setIsOpen(false)
      return
    }

    setIsOpen(false)
    setCurrentLanguage(langCode) // optimistic — button feels instant

    if (langCode === "en") {
      clearGoogTransCookie()
    } else {
      setGoogTransCookie(langCode)
    }

    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 left-4 z-50" ref={containerRef}>
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-48 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {!isLoaded && !error && (
            <p className="text-center py-2 text-sm text-gray-700">Loading languages...</p>
          )}
          {error && (
            <p className="text-center py-2 text-sm text-red-500">{error}</p>
          )}
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors ${
                currentLanguage === lang.code ? "font-medium bg-gray-50" : ""
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  )
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}