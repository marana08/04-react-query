import './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

const notify = () => toast.error('No movies found for your request.');

type Status = 'error' | 'success' | 'empty';
export default function App() {
    const [status, setStatus] = useState<Status>('empty');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    async function handleForm(query: string) {
        setIsLoading(true);
        try {
            const result: Movie[] = await fetchMovies(query);
            setMovies(result);
            if (result.length === 0) {
                notify();
                setStatus('empty');
            } else {
                setStatus('success');
            }
        } catch (err) {
            setStatus('error');
            setMovies([]);
            console.error(err);
        }
        setIsLoading(false);
    }
    const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
    const handleModalClose = () => setSelectedMovie(null);

    return (
        <>
            <SearchBar onSubmit={handleForm} />
            <Toaster />
            {status === 'success' && (
                <MovieGrid onSelect={handleMovieClick} movies={movies} />
            )}
            {status === 'error' && <ErrorMessage />}
            {isLoading && <Loader />}
            {selectedMovie && (
                <MovieModal onClose={handleModalClose} movie={selectedMovie} />
            )}
        </>
    );
}