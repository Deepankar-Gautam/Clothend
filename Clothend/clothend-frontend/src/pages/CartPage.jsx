import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CartPage({ cart, onRemoveCart, onUpdateDays, onCheckout, showMsg }) {
  var navigate = useNavigate()
  var [renterLocationUrl, setRenterLocationUrl] = useState("")

  var total = cart.reduce(function (sum, item) { return sum + item.price * (item.days || 1) }, 0)

  async function handleCheckout() {
    if (!renterLocationUrl) { showMsg("Please paste your Google Maps location link"); return }
    await onCheckout(renterLocationUrl)
    navigate('/account')
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="section">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p className="empty-cart-icon">🛒</p>
            <p className="empty">Your cart is empty</p>
            <button className="btn" onClick={function () { navigate('/browse') }}>Browse Clothes</button>
          </div>
        ) : (
          <>
            {cart.map(function (item, i) {
              var subtotal = item.price * (item.days || 1)
              return (
                <div key={i} className="cart-row">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>{item.type} · {item.size} · {item.gender}</p>
                    <p className="cart-item-price">₹{item.price}/day</p>
                  </div>
                  <div className="cart-days-control">
                    <div className="days-input-group compact">
                      <button className="days-btn" onClick={function () { if (item.days > 1) onUpdateDays(i, item.days - 1) }}>−</button>
                      <input type="number" min="1" max="30" value={item.days || 1}
                        onChange={function (e) { onUpdateDays(i, Math.max(1, parseInt(e.target.value) || 1)) }} />
                      <button className="days-btn" onClick={function () { onUpdateDays(i, (item.days || 1) + 1) }}>+</button>
                    </div>
                    <span className="days-label-sm">{item.days || 1} day{(item.days || 1) > 1 ? "s" : ""}</span>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-subtotal">₹{subtotal}</span>
                    <button className="btn-sm btn-remove" onClick={function () { onRemoveCart(i) }}>Remove</button>
                  </div>
                </div>
              )
            })}

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Items ({cart.length})</span>
                <span>₹{total}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="location-section">
              <h3>Delivery Location</h3>
              <input type="url" placeholder="Paste your Google Maps location link here" 
                value={renterLocationUrl} 
                onChange={function(e) { setRenterLocationUrl(e.target.value) }} 
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px' }} />
            </div>

            <button className="btn btn-full btn-checkout" onClick={handleCheckout}
              disabled={!renterLocationUrl}>
              Checkout · ₹{total}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
