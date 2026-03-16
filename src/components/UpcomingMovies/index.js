import {Component} from 'react'
import {ThreeDots} from 'react-loader-spinner'

import Navbar from '../Navbar'
import MovieCard from '../MovieCard'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UpcomingMovies extends Component {
  state = {
    apiStatus: apiConstants.initial,
    upcomingMoviesList: [],
    totalPages: 0,
    currentPage: 1,
  }

  componentDidMount() {
    this.getPopularMovies(1)
  }

  getPopularMovies = async page => {
    this.setState({apiStatus: apiConstants.inProgress})
    const upcomingMoviesURL = `https://api.themoviedb.org/3/movie/upcoming?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US&page=${page}`

    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(upcomingMoviesURL, options)

      if (!response.ok) {
        this.setState({apiStatus: apiConstants.failure})
        return
      }

      const data = await response.json()

      const updatedData = data.results.map(eachMovie => ({
        id: eachMovie.id,
        title: eachMovie.title,
        posterPath: eachMovie.poster_path,
        voteAverage: eachMovie.vote_average,
      }))

      this.setState({
        upcomingMoviesList: updatedData,
        apiStatus: apiConstants.success,
        totalPages: data.total_pages,
        currentPage: page,
      })
    } catch (error) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  goToPreviousPage = () => {
    const {currentPage} = this.state

    if (currentPage > 1) {
      this.getPopularMovies(currentPage - 1)
    }
  }

  goToNextPage = () => {
    const {currentPage, totalPages} = this.state

    if (currentPage < totalPages) {
      this.getPopularMovies(currentPage + 1)
    }
  }

  goToPage = page => {
    this.getPopularMovies(page)
  }

  renderPagination = () => {
    const {currentPage, totalPages} = this.state

    const nextPage1 = currentPage + 1
    const nextPage2 = currentPage + 2

    return (
      <div className="pagination-container">
        <button
          type="button"
          onClick={this.goToPreviousPage}
          disabled={currentPage === 1}
          className="page-button"
        >
          {'<<'}
        </button>

        <button
          type="button"
          onClick={() => this.goToPage(currentPage)}
          className="active-button"
        >
          {currentPage}
        </button>

        {nextPage1 <= totalPages && (
          <button
            type="button"
            onClick={() => this.goToPage(nextPage1)}
            className="page-button"
          >
            {nextPage1}
          </button>
        )}

        {nextPage2 <= totalPages && (
          <button
            type="button"
            onClick={() => this.goToPage(nextPage2)}
            className="page-button"
          >
            {nextPage2}
          </button>
        )}

        <button
          type="button"
          onClick={this.goToNextPage}
          disabled={currentPage === totalPages}
          className="page-button"
        >
          {'>>'}
        </button>
      </div>
    )
  }

  renderError = () => {
    const {currentPage} = this.state

    return (
      <div className="api-error-container">
        <h1 className="api-error-text">Something went wrong</h1>
        <button
          type="button"
          className="retry-button"
          onClick={() => this.getPopularMovies(currentPage)}
        >
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = () => {
    const {upcomingMoviesList} = this.state

    return (
      <>
        <Navbar />
        <div className="popular-movies-container">
          <h1 className="popular-heading">Popular</h1>

          <ul className="movies-list-container">
            {upcomingMoviesList.map(eachMovie => (
              <MovieCard key={eachMovie.id} movie={eachMovie} />
            ))}
          </ul>

          {this.renderPagination()}
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

  renderFinalView = () => {
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

  render() {
    return this.renderFinalView()
  }
}

export default UpcomingMovies
