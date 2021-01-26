import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //Validator에 도달하지 않음(개체를 제거)
            forbidNonWhitelisted: true, //리퀘스트 자체를 막음
            transform: true, //유저가 보낸 값을 원하는 타입으로 변환
        }),
    );
    await app.listen(3000);
}
bootstrap();
