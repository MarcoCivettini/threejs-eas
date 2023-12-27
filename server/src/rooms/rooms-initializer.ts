import { Server } from 'colyseus';
import { TestRoom } from './base-room';

export const initializeGameRooms = (gameServer: Server) => {
  gameServer.define("test_room", TestRoom, {
    
  })
}