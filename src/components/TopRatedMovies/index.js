// src/components/TopRatedMovies/index.js
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

class TopRatedMovies extends Component {
  state = {
    apiStatus: apiConstants.initial,
    moviesList: [],
    pageNumber: 1,
    totalPages: 1,
  }

  componentDidMount() {
    this.getMovies()
  }

  getMovies = async () => {
    const {pageNumber} = this.state
    this.setState({apiStatus: apiConstants.inProgress})
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=d3af25522bc1d33c14e81cf86ea8ba56&language=en-US&page=${pageNumber}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        this.setState({apiStatus: apiConstants.fail})
        return
      }
      const data = await response.json()
      const updatedList = data.results.map(eachMovie => ({
        id: eachMovie.id,
        title: eachMovie.title,
        voteAverage: eachMovie.vote_average,
        posterPath: eachMovie.poster_path,
      }))
      this.setState({
        apiStatus: apiConstants.success,
        moviesList: updatedList,
        totalPages: data.total_pages,
      })
    } catch {
      this.setState({apiStatus: apiConstants.fail})
    }
  }

  goToPage = page => this.setState({pageNumber: page}, this.getMovies)

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
              type="button"
              disabled={pageNumber === 1}
              onClick={() => this.goToPage(pageNumber - 1)}
            >
              {'<<'}
            </button>
            {Array.from({length: 5}, (_, idx) => {
              const page = pageNumber + idx - 2
              if (page < 1 || page > totalPages) return null
              return (
                <button
                  type="button"
                  key={page}
                  className={page === pageNumber ? 'active' : ''}
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
        return <p>Failed to fetch movies. Try again.</p>
      default:
        return null
    }
  }
}

export default TopRatedMovies
