export default function manifest() {
  return {
    name: '3BrosMotor - Quality Cars • Better Journeys',
    short_name: '3BrosMotor',
    description: 'Premier car dealership in Mwanza & Dar es Salaam, Tanzania. Quality Japanese car imports, commercial trucks, and genuine spares.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1c459c',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
