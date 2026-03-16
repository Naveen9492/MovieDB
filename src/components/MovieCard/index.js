import {withRouter} from 'react-router-dom'
import './index.css'

const MovieCard = props => {
  const {movie, history} = props

  const routeToMovieDetails = () => {
    history.push(`/movie/${movie.id}`)
  }

  return (
    <li className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-card-details-container">
        <div className="movie-card-title-rating-container">
          <p className="title">{movie.title}</p>
          <p className="rating">{movie.voteAverage}</p>
        </div>
        <button
          type="button"
          className="view-details-button"
          onClick={routeToMovieDetails}
        >
          View Details
        </button>
      </div>
    </li>
  )
}
export default withRouter(MovieCard)
