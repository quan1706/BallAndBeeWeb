import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "BallAndBeeWEB",
  description: "E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
