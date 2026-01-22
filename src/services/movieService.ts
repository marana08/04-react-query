import axios from "axios";
import type { Movie } from "../types/movie";

const KEY = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

interface FetchMoviesOptions {
    query: string;
    page?: number; 
}

export default async function fetchMovies({
    query,
    page = 1,
}: FetchMoviesOptions): Promise<FetchMoviesResponse> {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&page=${page}`;

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${KEY}`,
        },
    };

    const response = await axios.get<FetchMoviesResponse>(url, options);
    return response.data;
}
