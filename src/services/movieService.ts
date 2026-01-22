import axios from "axios";
import type { Movie } from "../types/movie";
const KEY = import.meta.env.VITE_TMDB_TOKEN;

interface fetchMoviesParams {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export default async function fetchMovies(                  
    query: string,
    page: number
): Promise<fetchMoviesParams> {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`;
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${KEY}`,
        },
    };

    const response = await axios.get<fetchMoviesParams>(url, options);
    return response.data;
}