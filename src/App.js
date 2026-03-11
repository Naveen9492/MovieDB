import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import PopularMovies from './components/PopularMovies'
import TopRatedMovies from './components/TopRatedMovies'
import UpcomingMovies from './components/UpcomingMovies'
import MovieDetails from './components/MovieDetails'
import SearchedMovies from './components/SearchedMovies'
import MovieContext from './context/MovieContext'

import './App.css'

class App extends Component {
  state = {searchInput: ''}

  updateSearchInput = value => {
    this.setState({searchInput: value})
  }

  render() {
    const {searchInput} = this.state

    return (
      <MovieContext.Provider
        value={{
          searchInput,
          updateSearchInput: this.updateSearchInput,
        }}
      >
        <Switch>
          <Route exact path="/" component={PopularMovies} />
          <Route exact path="/top-rated" component={TopRatedMovies} />
          <Route exact path="/upcoming" component={UpcomingMovies} />
          <Route exact path="/movies/:id" component={MovieDetails} />
          <Route exact path="/search" component={SearchedMovies} />
        </Switch>
      </MovieContext.Provider>
    )
  }
}

export default App
