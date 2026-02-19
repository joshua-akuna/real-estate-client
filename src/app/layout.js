import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: 'Real Estate App',
  description: 'Find your dream property',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
