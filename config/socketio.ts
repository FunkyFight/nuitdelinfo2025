import { defineConfig } from '@softmila/adonisjs-socketio'

const socketIoConfig = defineConfig({
  cors: {
    origin: '*',
  },
})

export default socketIoConfig