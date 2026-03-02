// // app/api/translate/route.ts
// export async function POST(req: Request) {
//   const { text, target } = await req.json()
//   const res = await fetch(
//     `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
//     {
//       method: "POST",
//       body: JSON.stringify({ q: text, target }),
//     }
//   )
//   const data = await res.json()
//   return Response.json({ translated: data.data.translations[0].translatedText })
// }
// app/api/translate/route.ts
export async function POST(req: Request) {
  const { texts, target } = await req.json()

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texts, target, format: "text" }),
    }
  )

  const data = await res.json()
  const translated = data.data.translations.map((t: any) => t.translatedText)
  return Response.json({ translated })
}
