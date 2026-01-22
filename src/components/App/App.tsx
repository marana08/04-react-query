import css from './App.module.css';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

const notify = () => toast.error('No movies found for your request.');

export default function App() {
    const [query, setQuery] = useState<string | ''>('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movie', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    function handleForm(newQuery: string) {
        setQuery(newQuery);
        setPage(1);
    }

    useEffect(() => {
        if (isSuccess && data?.results.length === 0) {
            notify();
        }
    }, [data, isSuccess]);

    const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
    const handleModalClose = () => setSelectedMovie(null);

    const totalPages = data?.total_pages ?? 0;

    return (
        <>
            <SearchBar onSubmit={handleForm} />
            <Toaster />
            {isSuccess && totalPages > 1 && (
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}
            {isError && <ErrorMessage />}
            {isLoading && <Loader />}
            {selectedMovie && (
                <MovieModal onClose={handleModalClose} movie={selectedMovie} />
            )}
            {isSuccess && (
                <MovieGrid onSelect={handleMovieClick} movies={data.results} />
            )}
        </>
    );
}