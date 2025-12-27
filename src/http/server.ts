import { app } from './app'

const PORT = process.env.PORT || 3333

export function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}
