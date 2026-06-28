import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'SheiDokan — Premium Bangladesh Commerce',description:'A premium marketplace and China sourcing ecosystem for Bangladesh.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
