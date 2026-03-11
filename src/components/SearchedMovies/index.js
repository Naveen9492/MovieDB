import {Component} from 'react'
import MovieContext from '../../context/MovieContext'
import Loader from '../Loader'
import MovieCard from '../MovieCard'
import Navbar from '../Navbar'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  inProgress: 'IN_PROGRESS',
}

class SearchedMovies extends Component {
  state = {
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
    pageNumber: 1,
    totalPages: 1,
  }

  componentDidMount() {
    this.getSearchResults()
  }

  getSearchResults = async () => {
    const {pageNumber} = this.state
    const {searchInput} = this.context

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = `https://api.themoviedb.org/3/search/movie?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US&query=${searchInput}&page=${pageNumber}`

    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()

      const updatedMovies = data.results.map(each => ({
        id: each.id,
        title: each.title,
        voteAverage: each.vote_average,
        posterPath: each.poster_path,
      }))

      this.setState({
        moviesList: updatedMovies,
        totalPages: data.total_pages,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.fail})
    }
  }

  goToPage = page => {
    this.setState({pageNumber: page}, this.getSearchResults)
  }

  renderSuccessView = () => {
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
              type="button"
              disabled={pageNumber === 1}
              onClick={() => this.goToPage(pageNumber - 1)}
              className="page-button"
            >
              {'<<'}
            </button>

            {Array.from({length: 5}, (_, index) => {
              const page = pageNumber + index - 2
              if (page < 1 || page > totalPages) return null

              return (
                <button
                  key={page}
                  type="button"
                  className={`page-button ${
                    page === pageNumber ? 'active' : ''
                  }`}
                  onClick={() => this.goToPage(page)}
                >
                  {page}
                </button>
              )
            })}

            <button
              type="button"
              disabled={pageNumber === totalPages}
              onClick={() => this.goToPage(pageNumber + 1)}
              className="page-button"
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
      case apiStatusConstants.inProgress:
        return <Loader />

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.fail:
        return <p>Failed to fetch searched movies.</p>

      default:
        return null
    }
  }
}

SearchedMovies.contextType = MovieContext

export default SearchedMovies
