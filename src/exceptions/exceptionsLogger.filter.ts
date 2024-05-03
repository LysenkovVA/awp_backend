import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ConsoleColor, ConsoleLogger } from "../helpers/ConsoleLogger";

@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus ? exception.getStatus() : 500;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
            error: exception.message,
            stack: exception.stack,
        });

        ConsoleLogger.PrintMessage(
            JSON.stringify({
                statusCode: status,
                timestamp: new Date().toISOString(),
                method: request.method,
                path: request.url,
                error: exception.message,
                stack: exception.stack,
            }),
            ConsoleColor.RED,
        );
    }
}
