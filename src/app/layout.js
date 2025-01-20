import './globals.css'

export const metadata = {
  title: 'Quiz Application',
  description: 'Quiz For All',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
