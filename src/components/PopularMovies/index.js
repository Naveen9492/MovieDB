import {Component} from 'react'
import Loader from '../Loader'
import MovieCard from '../MovieCard'
import Navbar from '../Navbar'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

class PopularMovies extends Component {
  state = {
    apiStatus: apiConstants.initial,
    moviesList: [],
    pageNumber: 1,
    totalPages: 1, // total pages from API
  }

  componentDidMount() {
    this.getMovies()
  }

  getMovies = async () => {
    const {pageNumber} = this.state
    this.setState({apiStatus: apiConstants.inProgress})

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US&page=${pageNumber}`

    const options = {
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        this.setState({apiStatus: apiConstants.fail})
        return
      }
      const data = await response.json()
      const updatedList = data.results.map(eachMovie => ({
        adult: eachMovie.adult,
        backdropPath: eachMovie.backdrop_path,
        genreIds: eachMovie.genre_ids,
        id: eachMovie.id,
        originalLanguage: eachMovie.original_language,
        originalTitle: eachMovie.original_title,
        overview: eachMovie.overview,
        popularity: eachMovie.popularity,
        posterPath: eachMovie.poster_path,
        releaseDate: eachMovie.release_date,
        title: eachMovie.title,
        video: eachMovie.video,
        voteAverage: eachMovie.vote_average,
        voteCount: eachMovie.vote_count,
      }))

      this.setState({
        apiStatus: apiConstants.success,
        moviesList: updatedList,
        totalPages: data.total_pages,
      })
    } catch (error) {
      this.setState({apiStatus: apiConstants.fail})
    }
  }

  goToPage = page => {
    this.setState({pageNumber: page}, this.getMovies)
  }

  successView = () => {
    const {moviesList, pageNumber, totalPages} = this.state

    return (
      <>
        <Navbar />
        <div className="movies-main-container">
          <ul className="movies-list-container">
            {moviesList.map(eachMovie => (
              <MovieCard key={eachMovie.id} moviesDetails={eachMovie} />
            ))}
          </ul>

          <div className="paging-container">
            <button
              className="page-button"
              type="button"
              disabled={pageNumber === 1}
              onClick={() => this.goToPage(pageNumber - 1)}
            >
              {'<<'}
            </button>

            {Array.from({length: 5}, (_, index) => {
              const page = pageNumber + index - 2
              if (page < 1 || page > totalPages) return null
              return (
                <button
                  key={page}
                  className={`page-button ${
                    page === pageNumber ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() => this.goToPage(page)}
                >
                  {page}
                </button>
              )
            })}

            <button
              className="page-button"
              type="button"
              disabled={pageNumber === totalPages}
              onClick={() => this.goToPage(pageNumber + 1)}
            >
              {'>>'}
            </button>
          </div>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return <Loader />
      case apiConstants.success:
        return this.successView()
      case apiConstants.fail:
        return <p>Failed to fetch movies. Please try again.</p>
      default:
        return null
    }
  }
}

export default PopularMovies
