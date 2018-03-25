"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const bodyParser = require("body-parser");
const express = require("express");
/**
 * The server.
 *
 * @class Server
 */
class Server {
    /**
     * Constructor.
     *
     * @class Server
     * @param port
     * @constructor
     */
    constructor(port) {
        //create expressjs application
        this.app = express();
        this.port = port;
        //configure application
        this.config();
        //add api
        this.api();
    }
    /**
     * Listen for incoming requests
     */
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port: ${this.port}!`);
        });
    }
    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    api() {
        new api_1.Api(this.app);
    }
    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    config() {
        //add static paths
        this.app.use('/', express.static('public/distqwe'));
        //mount json form parser
        this.app.use(bodyParser.json());
        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUEyQjtBQUMzQiwwQ0FBMEM7QUFDMUMsbUNBQW1DO0FBR25DOzs7O0dBSUc7QUFDSDtJQU9JOzs7Ozs7T0FNRztJQUNILFlBQVksSUFBVztRQUVuQiw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQix1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWQsU0FBUztRQUNULElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVmLENBQUM7SUFJRDs7T0FFRztJQUNJLE1BQU07UUFFVCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFJRDs7Ozs7T0FLRztJQUNJLEdBQUc7UUFFTixJQUFJLFNBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdEIsQ0FBQztJQUlEOzs7OztPQUtHO0lBQ0ksTUFBTTtRQUNULGtCQUFrQjtRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFFcEQsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWhDLHlDQUF5QztRQUN6QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFTLEdBQVEsRUFBRSxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBMEI7WUFDbkcsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0NBRUo7QUEvRUQsd0JBK0VDIn0=