import {Component} from 'react'
import {FiSearch} from 'react-icons/fi'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiOutlineClose} from 'react-icons/ai'
import {Link, withRouter} from 'react-router-dom'

import MovieContext from '../../context/MovieContext'

import './index.css'

class Navbar extends Component {
  state = {
    menuOpen: false,
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  closeMenu = () => {
    this.setState({menuOpen: false})
  }

  render() {
    const {menuOpen} = this.state
    const smallNaveContainerClass = menuOpen ? 'show' : 'hide'

    return (
      <MovieContext.Consumer>
        {value => {
          const {searchInput, updateSearchInput} = value
          const {history} = this.props

          const onChangeSearch = event => {
            updateSearchInput(event.target.value)
          }

          const onSearchMovies = () => {
            if (searchInput.trim() !== '') {
              history.push('/search')
            }
            this.closeMenu()
          }

          const onKeyDownSearch = event => {
            if (event.key === 'Enter') {
              onSearchMovies()
            }
          }

          return (
            <>
              <div className="navbar">
                <Link to="/" className="nav-link" onClick={this.closeMenu}>
                  <h1 className="logo">movieDB</h1>
                </Link>

                <div className="navbar-section-large">
                  <div className="search-container">
                    <input
                      type="search"
                      placeholder="Search Movies"
                      value={searchInput}
                      onChange={onChangeSearch}
                      onKeyDown={onKeyDownSearch}
                      className="search-input"
                    />

                    <button
                      type="button"
                      className="search-button"
                      onClick={onSearchMovies}
                    >
                      <FiSearch className="search-icon" />
                    </button>
                  </div>

                  <Link to="/" className="nav-link">
                    <button type="button" className="nav-button">
                      Popular Movies
                    </button>
                  </Link>

                  <Link to="/top-rated" className="nav-link">
                    <button type="button" className="nav-button">
                      Top Rated
                    </button>
                  </Link>

                  <Link to="/upcoming" className="nav-link">
                    <button type="button" className="nav-button">
                      Upcoming
                    </button>
                  </Link>
                </div>

                <div className="menu-open-close-container">
                  {!menuOpen ? (
                    <button
                      type="button"
                      className="open-close-button"
                      onClick={this.openMenu}
                    >
                      <GiHamburgerMenu className="menu-open-close-icon" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="open-close-button"
                      onClick={this.closeMenu}
                    >
                      <AiOutlineClose className="menu-open-close-icon" />
                    </button>
                  )}
                </div>
              </div>

              <div className={smallNaveContainerClass}>
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search Movies"
                    value={searchInput}
                    onChange={onChangeSearch}
                    onKeyDown={onKeyDownSearch}
                    className="search-input"
                  />

                  <button
                    type="button"
                    className="search-button"
                    onClick={onSearchMovies}
                  >
                    <FiSearch className="search-icon" />
                  </button>
                </div>

                <Link to="/" className="nav-link">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={this.closeMenu}
                  >
                    Popular Movies
                  </button>
                </Link>

                <Link to="/top-rated" className="nav-link">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={this.closeMenu}
                  >
                    Top Rated
                  </button>
                </Link>

                <Link to="/upcoming" className="nav-link">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={this.closeMenu}
                  >
                    Upcoming
                  </button>
                </Link>
              </div>
            </>
          )
        }}
      </MovieContext.Consumer>
    )
  }
}

export default withRouter(Navbar)
