import { Request } from 'express';
import { Server } from 'colyseus';

export type AppRequest = Request & NonNullable<{ gameServer: Server }>;