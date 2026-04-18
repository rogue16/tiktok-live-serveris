/**
 * TikTok Live WebSocket Server
 */

const { WebcastPushConnection } = require('tiktok-live-connector')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME || 'zyquoren'
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || '*'

const app = express()
app.use(cors({ origin: CLIENT_URL }))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] }
})

let tiktokLive = null
let isConnected = false

function connectToTikTok() {
  if (tiktokLive) tiktokLive.disconnect()
  
  tiktokLive = new WebcastPushConnection(TIKTOK_USERNAME, {
    processInitialData: true,
    enableExtendedGiftInfo: true,
    enableWebsocketUpgrade: true,
    requestPollingIntervalMs: 2000,
    clientParams: { app_language: 'en-US', device_platform: 'web' }
  })

  tiktokLive.connect()
    .then(state => {
      isConnected = true
      console.log(`✅ Connected to @${TIKTOK_USERNAME} - Viewers: ${state.viewerCount}`)
      io.emit('connected', { username: TIKTOK_USERNAME, viewerCount: state.viewerCount })
    })
    .catch(err => {
      console.error('❌ Connection failed:', err.message)
      setTimeout(() => connectToTikTok(), 5000)
    })

  tiktokLive.on('gift', data => {
    console.log(`🎁 ${data.nickname} sent ${data.giftName}`)
    io.emit('gift', {
      giftId: data.giftId,
      giftName: data.giftName,
      nickname: data.nickname,
      diamondCount: data.diamondCount,
      repeatCount: data.repeatCount,
      timestamp: Date.now()
    })
  })

  tiktokLive.on('roomUser', data => io.emit('viewer', { viewerCount: data.viewerCount }))
  tiktokLive.on('disconnected', () => { isConnected = false; io.emit('disconnected') })
  tiktokLive.on('streamEnd', () => { isConnected = false; io.emit('streamEnd') })
}

io.on('connection', socket => {
  console.log('🔌 Client connected')
  socket.emit('status', { connected: isConnected, username: TIKTOK_USERNAME })
})

app.get('/', (req, res) => res.json({ status: 'running', tiktokConnected: isConnected }))

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  connectToTikTok()
})
