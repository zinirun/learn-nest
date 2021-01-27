import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { checkServerIdentity } from 'tls';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
    let service: MoviesService;

    // 테스트 전 실행
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
    });

    // 테스트 수행
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAll', () => {
        it('should be return an array', () => {
            const result = service.getAll();
            expect(result).toBeInstanceOf(Array);
        });
    });

    describe('getOne', () => {
        it('should return a movie', () => {
            service.create({
                title: 'Test Movie',
                genres: ['test'],
                year: 2000,
            });
            const movie = service.getOne(1);
            expect(movie).toBeDefined();
        });
    });

    describe('deleteOne', () => {
        it('deletes a movie', () => {
            service.create({
                title: 'Test Movie',
                genres: ['test'],
                year: 2000,
            });
            const beforeDelete = service.getAll().length;
            service.deleteOne(1);
            const afterDelete = service.getAll().length;
            expect(afterDelete).toBeLessThan(beforeDelete);
        });
        it('should return a 404', () => {
            try {
                service.deleteOne(999);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });

    describe('create', () => {
        it('should create a movie', () => {
            const beforeCreate = service.getAll().length;
            service.create({
                title: 'Test Movie',
                genres: ['test'],
                year: 2000,
            });
            const afterCreate = service.getAll().length;
            expect(afterCreate).toBeGreaterThan(beforeCreate);
        });
    });
});
