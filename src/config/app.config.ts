import packgeJson from '../../package.json' assert { type: 'json' }

export const AppConfig = {
  APP_NAME: packgeJson.name,
  APP_TITLE: 'Inmovia',
  APP_VERSION: packgeJson.version,
  APP_ENV: import.meta.env.MODE ?? 'development',
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  API_STRIPE: import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? 'pk_test_51RbkFwFjQ2yFgLKJe7AI1FMT2qTCY9fLKl3ZTgmpkB3nd5edL5IogJNuvfxjfqFmOazv5x7zKNa4zcAr42C1Wnv900lO3U16kC'
}
