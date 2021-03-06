require('source-map-support').install();
process.on('unhandledRejection', console.log);
import { Server } from './server'
import config from "./config";

/**
 * Create a new Server
 *
 * @type {Server}
 */
let server = new Server(config.port);

// then listen to it
server.listen();