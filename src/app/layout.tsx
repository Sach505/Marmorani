// Minimal root layout - locale-specific layout handles the full structure
// This is required by Next.js App Router for the root app directory

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
