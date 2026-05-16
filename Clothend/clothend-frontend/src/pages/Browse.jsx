import { useState, useEffect } from 'react'
import { fetchClothes } from '../api'
import ClothItem from '../components/ClothItem'

function Browse({ favourites, cart, onToggleFav, onAddCart }) {
  var [clothesData, setClothesData] = useState([])
  var [search, setSearch] = useState("")
  var [gender, setGender] = useState("")
  var [type, setType] = useState("")
  var [selected, setSelected] = useState(null)
  var [selectedDays, setSelectedDays] = useState(1)
  var [loading, setLoading] = useState(true)

  useEffect(function () {
    fetchClothes()
      .then(function (data) { setClothesData(data); setLoading(false) })
      .catch(function () { setLoading(false) })
  }, [])

  var cartClothIds = cart.map(function (item) { return item.clothId })

  var filtered = clothesData.filter(function (item) {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    if (gender && item.gender !== gender) return false
    if (type && item.type !== type) return false
    return true
  })

  function isItemInCart(itemId) { return cartClothIds.indexOf(itemId) > -1 }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  function openDetail(item) {
    setSelected(item)
    setSelectedDays(1)
  }

  if (loading) return <div className="center-msg"><p>Loading clothes...</p></div>

  return (
    <div className="browse">
      <div className="filters">
        <input placeholder="Search clothes..." value={search} onChange={function (e) { setSearch(e.target.value) }} />
        <select value={gender} onChange={function (e) { setGender(e.target.value) }}>
          <option value="">All Genders</option><option>Male</option><option>Female</option>
        </select>
        <select value={type} onChange={function (e) { setType(e.target.value) }}>
          <option value="">All Types</option>
          <option>T-Shirts</option><option>Hoodies</option><option>Jeans</option><option>Shirts</option>
          <option>Blazers</option><option>Jackets</option><option>Ethnic Wear</option><option>Casual Wear</option>
        </select>
      </div>

      <div className="clothes-grid">
        {filtered.length === 0 && <p className="no-results">No results found</p>}
        {filtered.map(function (item) {
          return <ClothItem key={item._id} item={item} isFav={favourites.includes(item._id)}
            isInCart={isItemInCart(item._id)} onFav={onToggleFav} onCart={function () { openDetail(item) }}
            onImageClick={function () { openDetail(item) }} />
        })}
      </div>

      {selected && (
        <div className="popup-bg" onClick={function () { setSelected(null) }}>
          <div className="popup product-popup" onClick={function (e) { e.stopPropagation() }}>
            <button className="close-btn" onClick={function () { setSelected(null) }}>✕</button>
            <img
              src={selected.image}
              alt={selected.name}
              onError={function (e) {
                e.target.onerror = null
                e.target.src = `https://picsum.photos/seed/fallback-${selected._id || selected.id}/300/400`
              }}
            />
            <h2>{selected.name}</h2>
            <p><strong>Gender:</strong> {selected.gender} · <strong>Size:</strong> {selected.size}</p>
            <p><strong>Color:</strong> {selected.color} · <strong>Type:</strong> {selected.type}</p>

            {selected.available === false ? (
              <>
                <p className="unavailable-text">This item is currently rented out.</p>
                {selected.availableDate && <p className="unavailable-text">Available again on {formatDate(selected.availableDate)}</p>}
                <div className="card-btns">
                  <button className="btn-sm" onClick={function () { onToggleFav(selected._id) }}>
                    {favourites.includes(selected._id) ? "♥ Liked" : "♡ Like"}
                  </button>
                  <button className="btn" disabled style={{ opacity: 0.5 }}>Unavailable</button>
                </div>
              </>
            ) : isItemInCart(selected._id) ? (
              <>
                <p className="price">₹{selected.price}/day</p>
                <div className="card-btns">
                  <button className="btn-sm" onClick={function () { onToggleFav(selected._id) }}>
                    {favourites.includes(selected._id) ? "♥ Liked" : "♡ Like"}
                  </button>
                  <button className="btn" disabled style={{ opacity: 0.7 }}>✓ Already in Cart</button>
                </div>
              </>
            ) : (
              <>
                <div className="days-selector">
                  <label>Rent for:</label>
                  <div className="days-input-group">
                    <button className="days-btn" onClick={function () { setSelectedDays(Math.max(1, selectedDays - 1)) }}>−</button>
                    <input type="number" min="1" max="30" value={selectedDays}
                      onChange={function (e) { setSelectedDays(Math.max(1, parseInt(e.target.value) || 1)) }} />
                    <button className="days-btn" onClick={function () { setSelectedDays(Math.min(30, selectedDays + 1)) }}>+</button>
                    <span className="days-label">day{selectedDays > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <p className="price">₹{selected.price}/day × {selectedDays} = <strong>₹{selected.price * selectedDays}</strong></p>
                <div className="card-btns">
                  <button className="btn-sm" onClick={function () { onToggleFav(selected._id) }}>
                    {favourites.includes(selected._id) ? "♥ Liked" : "♡ Like"}
                  </button>
                  <button className="btn" onClick={function () { onAddCart(selected, selectedDays); setSelected(null) }}>Add to Cart</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Browse
