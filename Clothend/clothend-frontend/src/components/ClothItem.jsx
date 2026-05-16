function ClothItem({ item, isFav, isInCart, onFav, onCart, onImageClick }) {
  var isUnavailable = item.available === false

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className={"cloth-card" + (isUnavailable ? " unavailable" : "")}>
      <div className="card-img-wrapper">
        <img
          src={item.image}
          alt={item.name}
          onClick={onImageClick}
          onError={function (e) {
            e.target.onerror = null
            e.target.src = `https://picsum.photos/seed/fallback-${item._id || item.id}/300/400`
          }}
        />
        {isUnavailable && <div className="unavailable-overlay">Unavailable</div>}
        {!isUnavailable && isInCart && <div className="in-cart-badge">In Cart</div>}
      </div>
      <h4>{item.name}</h4>
      <p className="price">₹{item.price}/day</p>
      {isUnavailable && item.availableDate && (
        <p className="available-date-label">Available {formatDate(item.availableDate)}</p>
      )}
      <div className="card-btns">
        <button className={"btn-sm" + (isFav ? " liked" : "")}
          onClick={function () { onFav(item._id) }}>
          {isFav ? "♥" : "♡"}
        </button>
        {isUnavailable ? (
          <button className="btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Unavailable</button>
        ) : isInCart ? (
          <button className="btn-sm in-cart-btn" disabled>✓ In Cart</button>
        ) : (
          <button className="btn-sm" onClick={function () { onCart(item) }}>+ Cart</button>
        )}
      </div>
    </div>
  )
}

export default ClothItem
