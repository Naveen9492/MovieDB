import {Component} from 'react'
import {ThreeDots} from 'react-loader-spinner'

import './index.css'
import Navbar from '../Navbar'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieDetails extends Component {
  state = {
    movieDetails: {},
    castList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getMovieAndCastDetails()
  }

  getMovieAndCastDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const getMovieDetailsURL = `https://api.themoviedb.org/3/movie/${id}?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US`
    const getMovieCastDetailsURL = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US`
    const options = {
      method: 'GET',
    }
    try {
      const movieRespone = await fetch(getMovieDetailsURL, options)
      const movieData = await movieRespone.json()
      const castResponse = await fetch(getMovieCastDetailsURL, options)
      const castData = await castResponse.json()
      const updatedMovieData = {
        title: movieData.title,
        posterPath: movieData.poster_path,
        voteAverage: movieData.vote_average,
        runtime: movieData.runtime,
        releaseDate: movieData.release_date,
        backdropPath: movieData.backdrop_path,
        overview: movieData.overview,
        genres: movieData.genres,
      }
      const updatedCastData = castData.cast.map(eachCast => ({
        profilePath: eachCast.profile_path,
        character: eachCast.character,
        originalName: eachCast.original_name,
      }))

      this.setState({
        movieDetails: updatedMovieData,
        castList: updatedCastData,
        apiStatus: apiConstants.success,
      })
    } catch (error) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {movieDetails, castList} = this.state

    return (
      <>
        <Navbar />
        <div className="movie-cast-details-container">
          <div className="movie-details-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.posterPath}`}
              alt={movieDetails.title}
              className="movie-details-poster"
            />
            <div className="movie-details-text-container">
              <p className="movie-title">{movieDetails.title}</p>
              <p className="overview-heading">Overview</p>
              <p className="overview-para">{movieDetails.overview}</p>
              <div className="movie-other-details-container">
                <p className="overview-heading">Release Date</p>
                <p className="overview-para">{movieDetails.releaseDate}</p>
                <p className="overview-heading">Genre</p>
                <div className="genre-container">
                  <div className="genre-container">
                    {movieDetails.genres &&
                      movieDetails.genres.map(eachGenre => (
                        <p className="genre-text" key={eachGenre.id}>
                          {eachGenre.name}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cast-details-container">
            {castList.map(eachCast => (
              <div className="cast-card" key={eachCast.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${eachCast.profilePath}`}
                  className="cast-image"
                  alt={eachCast.originalName}
                />
                <p className="cast-original-name">{eachCast.originalName}</p>
                <p className="cast-character">{eachCast.character}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container">
      <ThreeDots
        height="60"
        width="60"
        color="rgba(255, 107, 107, 0.8)"
        visible
      />
    </div>
  )

  renderError = () => (
    <div className="api-error-container">
      <h1 className="api-error-text">Something went wrong</h1>
      <button
        type="button"
        className="retry-button"
        onClick={() => this.getMovieAndCastDetails()}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderError()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}
export default MovieDetails
