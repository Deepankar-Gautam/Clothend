import { NavLink } from 'react-router-dom'

function Navbar({ user, cartCount, onAccountClick }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">Clothend</NavLink>
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/browse">Browse</NavLink>
        <NavLink to="/rent">Rent Clothes</NavLink>
        {user
          ? <NavLink to="/cart" className="cart-link">
              Cart{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>
          : <button onClick={onAccountClick}>Cart</button>
        }
        {user
          ? <NavLink to="/account">Account</NavLink>
          : <button onClick={onAccountClick}>Account</button>
        }
      </div>
    </nav>
  )
}

export default Navbar
