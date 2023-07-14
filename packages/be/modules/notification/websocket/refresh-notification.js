console.log('⚡️ [websocket] module|notification|refresh-notifications')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const MC = require('@Root/config')

// //////////////////////////////////////////////////////////////////// Endpoint
// -----------------------------------------------------------------------------
MC.socket.listeners.push({
  name: 'script|refresh-notifications|initialize',
  handler (userId) {
    MC.socket.io.to(userId).emit('script|refresh-notifications|event')
  }
})
