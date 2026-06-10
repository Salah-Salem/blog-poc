import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'BlogBook — Social Blog Feed',
  description: 'Facebook-style blog platform powered by Next.js and PrimeReact',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
