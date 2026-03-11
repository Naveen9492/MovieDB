import {Component} from 'react'
import Navbar from '../Navbar'
import Loader from '../Loader'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

class MovieDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: {},
    castList: [],
  }

  componentDidMount() {
    this.getMovieDetails()
  }

  getMovieDetails = async () => {
    const {match} = this.props
    const {id} = match.params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US`,
      )

      const movieData = await movieResponse.json()

      const castResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US`,
      )

      const castData = await castResponse.json()

      const updatedCast = castData.cast.map(each => ({
        id: each.cast_id,
        name: each.name,
        character: each.character,
        profilePath: each.profile_path,
      }))

      this.setState({
        movieDetails: movieData,
        castList: updatedCast,
        apiStatus: apiStatusConstants.success,
      })
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.fail})
    }
  }

  renderMovieDetails = () => {
    const {movieDetails, castList} = this.state

    return (
      <>
        <Navbar />

        <div className="movie-details-container">
          <div className="movie-info">
            <img
              src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="movie-poster"
            />

            <div className="movie-text">
              <h2>{movieDetails.title}</h2>

              <p>
                <strong>Rating:</strong> {movieDetails.vote_average}
              </p>

              <p>
                <strong>Duration:</strong> {movieDetails.runtime} mins
              </p>

              <p>
                <strong>Genres:</strong>{' '}
                {movieDetails.genres &&
                  movieDetails.genres.map(each => each.name).join(', ')}
              </p>

              <p>
                <strong>Release Date:</strong> {movieDetails.release_date}
              </p>

              <p className="overview">{movieDetails.overview}</p>
            </div>
          </div>

          <h3 className="cast-heading">Cast</h3>

          <ul className="cast-list">
            {castList.map(each => (
              <li key={each.id} className="cast-card">
                <img
                  src={
                    each.profilePath
                      ? `https://image.tmdb.org/t/p/original${each.profilePath}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={each.name}
                  className="cast-image"
                />

                <p className="cast-name">{each.name}</p>

                <p className="cast-character">as {each.character}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-view">
      <Navbar />
      <p>Failed to fetch movie details. Please try again.</p>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loader />

      case apiStatusConstants.success:
        return this.renderMovieDetails()

      case apiStatusConstants.fail:
        return this.renderFailure()

      default:
        return null
    }
  }
}

export default MovieDetails
