const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZmQ1Mzc4MzJhYzdlNmJlYzI3NGE4YTAzMmY0ZmQ0MiIsIm5iZiI6MTc1MDY4MDI2MS43MTYsInN1YiI6IjY4NTk0MmM1ZjhhYWI2ZTZiYmQwZmJhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pg49xqP9sfUFD0L9WKeiQ_WjHiwcsO3tMdWOEeZSWSA';

function App() {
  const [query, setQuery] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const [popular, setPopular] = React.useState([]);
  const [ratings, setRatings] = React.useState({});

  React.useEffect(() => {
    const saved = localStorage.getItem('movieRatings');
    if (saved) setRatings(JSON.parse(saved));

    fetch('https://api.themoviedb.org/3/trending/movie/week', {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      }
    })
      .then(res => res.json())
      .then(data => setPopular(data.results))
      .catch(console.error);
  }, []);

  function searchMovies(text) {
    if (!text.trim()) {
      setMovies([]);
      return;
    }
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(text)}`, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      }
    })
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(console.error);
  }

  function onChange(e) {
    const val = e.target.value;
    setQuery(val);
    searchMovies(val);
  }

  function starClick(id, star) {
    let newRatings = {...ratings};
    if (ratings[id] === star) {
      delete newRatings[id];
    } else {
      newRatings[id] = star;
    }
    setRatings(newRatings);
    localStorage.setItem('movieRatings', JSON.stringify(newRatings));
  }

  const list = query.trim() === '' ? popular : movies;

  return (
    <div>
      <h1>Catálogo de Películas</h1>
      <input type="text" placeholder="Buscar" value={query} onChange={onChange} />
      <div className="movie-list">
        {list.map(m => (
          <div key={m.id} className="movie-card">
            <img src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/300x450?text=Sin+Imagen'} alt={m.title} />
            <div>{m.title} ({m.release_date ? m.release_date.substring(0,4) : '??'})</div>
            <div>
              {[1,2,3,4,5].map(s => (
                <span
                  key={s}
                  className={'star ' + (ratings[m.id] >= s ? 'filled' : '')}
                  onClick={() => starClick(m.id, s)}
                >★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
