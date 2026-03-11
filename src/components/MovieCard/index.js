import {withRouter} from 'react-router-dom'
import './index.css'

const MovieCard = props => {
  const {moviesDetails, history} = props

  const goToMovieDetails = () => {
    history.push(`/movies/${moviesDetails.id}`)
  }

  return (
    <li className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/original${moviesDetails.posterPath}`}
        alt={moviesDetails.title}
        className="poster"
      />
      <p className="movie-title">{moviesDetails.title}</p>
      <p className="movie-rating">Rating: {moviesDetails.voteAverage}</p>
      <button
        type="button"
        className="movie-details-button"
        onClick={goToMovieDetails}
      >
        View Details
      </button>
    </li>
  )
}

export default withRouter(MovieCard)
