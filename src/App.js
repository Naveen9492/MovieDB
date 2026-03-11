import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import PopularMovies from './components/PopularMovies'
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
        </Switch>
      </MovieContext.Provider>
    )
  }
}

export default App
