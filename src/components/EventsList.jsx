import React, { useState } from 'react';
import { styles } from '../styles';
const Movies = () => {
    const [movieTitle, setMovieTitle] = useState('');
    const [movies, setMovies] = useState([]); // Инициализация как пустой массив
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchMovies = () => {
        if (!movieTitle) return;

        setLoading(true);
        setError('');

        fetch(`http://www.omdbapi.com/?s=${movieTitle}&apikey=6e24db0`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(data => {
                if (data.Response === 'True') {
                    setMovies(data.Search); // Устанавливаем список фильмов
                } else {
                    setMovies([]); // Обнуляем массив в случае ошибки
                    setError(data.Error);
                }
            })
            .catch(err => {
                setMovies([]); // Обнуляем массив в случае ошибки
                setError('Ошибка при получении данных о фильмах: ' + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchMovies(); // Вызываем функцию для получения списка фильмов
    };

    return (
        <div>
            <h1>Поиск фильма</h1>
            <p>Все названия на английском. Например Blade Runner</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={movieTitle} 
                    onChange={(e) => setMovieTitle(e.target.value)} 
                    placeholder="Введите название фильма" 
                />
                <button type="submit">Найти фильмы</button>
            </form>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {movies.length > 0 && (
                <div style={styles.moviesGrid}>
                {movies.map(movie => (
                    <div key={movie.imdbID} style={styles.card}>
                        <img src={movie.Poster} alt={movie.Title} style={styles.poster} />
                        <h3>{movie.Title}</h3>
                        <p>Год: {movie.Year}</p>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};




export default Movies;
