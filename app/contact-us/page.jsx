'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactPage from '../contact/page';

export default function ContactUsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/contact');
  }, [router]);

  return <ContactPage />;
}
