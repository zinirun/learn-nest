import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll();
    }

    @Get('search')
    search(@Query('year') searchingYear: number): Movie[] {
        return this.moviesService.search(searchingYear);
    }

    @Get(':id')
    getOne(@Param('id') movieId: number): Movie {
        return this.moviesService.getOne(movieId);
    }

    @Post()
    create(@Body() movieData: CreateMovieDto): void {
        return this.moviesService.create(movieData);
    }

    @Delete(':id')
    remove(@Param('id') movieId: number): void {
        return this.moviesService.deleteOne(movieId);
    }

    @Patch(':id')
    patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto): void {
        return this.moviesService.update(movieId, updateData);
    }
}
