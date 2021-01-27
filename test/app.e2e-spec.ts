import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    // 테스트 할때마다가 아닌 한번만 하도록 beforeAll 설정
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        // 실제 app의 pipe를 test에도 별도로 적용해야 데코레이터가 적용됨
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true, //Validator에 도달하지 않음(개체를 제거)
                forbidNonWhitelisted: true, //리퀘스트 자체를 막음
                transform: true, //유저가 보낸 값을 원하는 타입으로 변환
            }),
        );
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect('Welcome to movie API');
    });

    describe('/movies', () => {
        it('GET 200', () => {
            return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
        });
        it('POST 201', () => {
            return request(app.getHttpServer())
                .post('/movies')
                .send({
                    title: 'Test',
                    year: 2020,
                    genres: ['test'],
                })
                .expect(201);
        });
        it('POST 400', () => {
            return request(app.getHttpServer())
                .post('/movies')
                .send({
                    title: 'Test',
                    year: 2020,
                    genres: ['test'],
                    other: 'thing',
                })
                .expect(400);
        });
        it('DELETE 404', () => {
            return request(app.getHttpServer()).delete('/movies').expect(404);
        });
    });

    describe('/movies/:id', () => {
        /*
        테스트에서는 pipe 없는 새로운 어플리케이션을 생성하므로 pipe에 transform, whitelist 등 옵션(globalPipe)도 다시 설정해야함
        */
        it('GET 200', () => {
            return request(app.getHttpServer()).get('/movies/1').expect(200);
        });
        it('GET 404', () => {
            return request(app.getHttpServer()).get('/movies/999').expect(404);
        });
        it('POST 404', () => {
            return request(app.getHttpServer()).post('/movies/1').expect(404);
        });
        it('PATCH 200', () => {
            return request(app.getHttpServer())
                .patch('/movies/1')
                .send({ title: 'Updated Test' })
                .expect(200);
        });
        it('DELETE 200', () => {
            return request(app.getHttpServer()).delete('/movies/1').expect(200);
        });
        it('DELETE 404', () => {
            return request(app.getHttpServer()).delete('/movies/999').expect(404);
        });
    });

    describe('/movies/search?year=:number', () => {
        it('GET 200', () => {
            return request(app.getHttpServer()).get('/movies/search?year=0').expect(200).expect([]);
        });
    });
});
