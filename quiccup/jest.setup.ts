import { Request, Response } from 'undici';
(globalThis as any).Request = Request;
(globalThis as any).Response = Response;
