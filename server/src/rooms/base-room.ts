import http from 'node:http';
import { Room, Client } from 'colyseus';

export class TestRoom extends Room {
    // When room is initialized
    onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    // onAuth (client: Client, options: any, request: http.IncomingMessage) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) {
      console.log('client joined');
    }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) {
      client.leave();
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}