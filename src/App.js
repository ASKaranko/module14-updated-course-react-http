import React, {useState, useEffect, useCallback} from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from "./components/AddMovie";
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-updated-course-http' +
          '-default-rtdb.firebaseio.com/movies.json');
      // Так как мы работаем не с axios, сделаем свой перехватчик
      // catch(error) срабатывает только, если мы выполняем действия с данными,
      // но такой throw даст возможность узнать результат запроса раньше и передать
      // результат в catch(error) с нужным описанием ошибки
      if (!response.ok) {
        throw new Error(`Something went wrong ${response.status} error`);
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          });
        }
      }
      // const transformedMovies = data.results.map(movieData => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message)
    }
      setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = async (movie) => {
    const response = await fetch('https://react-updated-course-http' +
        '-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    fetchMoviesHandler();
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/*{!isLoading && movies.length > 0 && <MoviesList movies={movies} />}*/}
        {/*{!isLoading && movies.length === 0 && !error && <p>Found no movies</p>}*/}
        {/*{!isLoading && error && <p>{error}</p>}*/}
        {/*{isLoading && <p>Loading...</p>}*/}
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
