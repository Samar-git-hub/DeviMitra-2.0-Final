import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/',
//   server: {
//     open: true,
//     middleware: [
//       (req, res, next) => {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         next();
//       }
//     ]
//   },
// })
