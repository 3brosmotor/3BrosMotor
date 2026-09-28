export const metadata = {
  title: 'Admin Portal | 3BrosMotor Dealership Management',
  description: 'Internal fleet, purchase, expense, and sales management portal for 3BrosMotor.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
