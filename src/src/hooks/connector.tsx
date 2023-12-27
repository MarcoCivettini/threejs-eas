import * as Colyseus from 'colyseus.js';
import { useEffect } from 'preact/hooks';

export const useColyeusClient = (url: string) => {
  const client = new Colyseus.Client(url);

  useEffect(() => {
    client.joinOrCreate('test_room').then(room => {
      console.log(room.sessionId, 'joined', room.name);
    }).catch(e => {
        console.log('JOIN ERROR', e);
        
        client.reconnect('test_room');
    });
  }, []);

  return client;
}