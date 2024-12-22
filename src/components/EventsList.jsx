import React, { useState } from 'react';

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


const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: '#fff',
        cursor: 'pointer',
    },
    cardContainer: {
        marginTop: '20px',
    },
    moviesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        textAlign: 'left',
    },
    poster: {
        width: '100%',
        borderRadius: '4px',
    },
};


export default Movies;
