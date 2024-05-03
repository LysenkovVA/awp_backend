import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import cookieParser from "cookie-parser"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ExceptionsLoggerFilter } from "./exceptions/exceptionsLogger.filter"
import { ConsoleColor, ConsoleLogger } from "./helpers/ConsoleLogger"
import "reflect-metadata"

async function bootstrap() {
    ConsoleLogger.PrintMessage(
        `MODE: ${process.env.NODE_ENV}`,
        ConsoleColor.YELLOW,
    )
    const PORT = process.env.PORT || 5001
    const app = await NestFactory.create(AppModule, {
        logger: ["error", "warn"],
        // Опция для Frontend
        // В Axios цепляются куки, сообщаем по какому адресу наш фронтент
        cors: {
            credentials: true,
            origin: "http://localhost:3000",
        },
    })
    app.setGlobalPrefix("/api")
    app.use(cookieParser())

    // ВСЕГДА ПОСЛЕДНИЙ! Перехватчик ошибок
    app.useGlobalFilters(new ExceptionsLoggerFilter())

    // Настройка документации
    const config = new DocumentBuilder()
        .setTitle("АРМ руководителя")
        .setDescription("Лысенков Виктор")
        .setVersion("1.0.0")
        .addTag("REST API")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("/api/docs", app, document)

    await app.listen(PORT, () =>
        ConsoleLogger.PrintMessage(
            `Server started on port ${PORT}`,
            ConsoleColor.GREEN,
        ),
    )
}
bootstrap()
