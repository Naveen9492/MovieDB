import {createContext} from 'react'

const MovieContext = createContext({
  searchInput: '',
  updateSearchInput: () => {},
})

export default MovieContext
