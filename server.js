'use strict'

let WebSocketServer = require('ws').Server
let portfinder = require('portfinder')

module.exports.start = () => {
  return new Promise((resolve, reject) => {
    let wss
    // portfinder looks for open port for WebSocket server
    portfinder.getPort((err, port) => {
      if (err) {
        console.log(err)
        return
      }
      wss = new WebSocketServer({port}, function () {
        console.log('Server run on: ws://localhost:' + port)
        resolve(wss)
      })

      wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          let obj = JSON.parse(message)

          // Check income message format
          if (obj.hasOwnProperty('type')) {
            if (obj.type === 'icecandidate' || obj.type === 'offer') {
              // If 'index' property exists then this message comes from the peer
              // who triggered connection
              if (obj.hasOwnProperty('index')) {
                ws.peers[obj.index].send(message)
              } else {
                // Otherwise it comes from one of peers wishing to connect
                ws.peer.send(message)
              }
              return
            } else if (obj.type === 'open') {
              return _open(ws, obj.id)
            } else if (obj.type === 'join') {
              return _join(ws, obj.id)
            }
          }

          // Close web socket if income message format is unknown
          ws.close()
        })
      })
    })

    /**
     * Handles 'open' request from a client.
     *
     * @param  {WebSocket} ws web socket of a peer who triggered connection
     * @param  {string} id identifier sent by him
     * @return {void}
     */
    function _open (ws, id) {
      for (let i in wss.clients) {
        if (wss.clients[i].roomId === id) {
          ws.close()
        }
      }
      ws.roomId = id
      ws.peers = []
    }

    /**
     * Handles 'join' request from a client.
     *
     * @param  {WebScoket} ws web socket of a peer wishing to connect
     * @param  {string} id identifier of connection
     * @return {void}
     */
    function _join (ws, id) {
      for (let i in wss.clients) {
        if (wss.clients[i].roomId === id) {
          ws.peer = wss.clients[i]
          wss.clients[i].peers.push(ws)
          wss.clients[i].send('{"type":"join"}')
          return
        }
      }
      ws.close()
    }
  })
}