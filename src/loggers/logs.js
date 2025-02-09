const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, align, printf } = format;
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');
const { File } = require('winston/lib/winston/transports');

/**
 * error
 * warning
 * debug    
 * info
 * requestId
 */
class Logger {
    constructor() {
        const myFormat = printf(({ level, message, context, requestId, timestamp, body }) => {
            return `${timestamp}::[${level}]::${requestId}::${message}::${body}`;
        });

        this.logger = winston.createLogger({
            level: 'info',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                myFormat
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: '%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-mm',
                    zippedArchive: true,  // nen file log
                    maxSize: '50m', //dung luong file log
                    maxFiles: '8d', //so ngay giu file log => se xoa trong 8 ngay
                    format: combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        myFormat
                    ),
                    level: 'error'
                })
            ]
        });
    }
    commonParams(params) {
        let context, req, metadata;
        if (params instanceof File) {
            // Xử lý trường hợp params là một File
            context = params.name; // hoặc bất kỳ thông tin nào phù hợp
            metadata = {};
        } else if (!Array.isArray(params) && typeof params === 'object' && params !== null) {
            try {
                return JSON.stringify(params);
            } catch (error) {
                console.error('Error stringifying params:', error);
                return '';
            }
        } else if (Array.isArray(params)) {
            [context, req, metadata] = params;
            context = context.toString();
            metadata = metadata ? this.serializeObject(metadata) : {};
        } else {
            context = String(params); // Chuyển đổi params thành chuỗi an toàn
        }
        const requestId = req && req.userID ? req.userID : uuidv4();
        return { context, requestId, metadata };
    }

    serializeObject(obj) {
        return JSON.parse(JSON.stringify(obj, (key, value) =>
            typeof value === 'object' && value !== null ? value : value.toString()
        ));
    }

    error(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = { message, ...paramLog };
        this.logger.error(logObject);
    }
}

module.exports = new Logger();