import { useState, useEffect } from 'react'
import { fetchClothes, getOrders, requestChangeEmailOTP, verifyChangeEmail, requestChangePasswordOTP, verifyChangePassword } from '../api'
import ClothItem from '../components/ClothItem'

function Account({ user, favourites, onToggleFav, onLogout, showMsg }) {
  var [tab, setTab] = useState("profile")
  var [clothesData, setClothesData] = useState([])
  var [orders, setOrders] = useState([])

  // Change Email Flow State
  var [changeEmailPopup, setChangeEmailPopup] = useState(false)
  var [emailFlowState, setEmailFlowState] = useState(1)
  var [newEmailInput, setNewEmailInput] = useState("")
  var [emailOtpInput, setEmailOtpInput] = useState("")
  var [emailTimer, setEmailTimer] = useState(0)

  // Change Password Flow State
  var [changePasswordPopup, setChangePasswordPopup] = useState(false)
  var [passwordFlowState, setPasswordFlowState] = useState(1)
  var [currentPassInput, setCurrentPassInput] = useState("")
  var [newPassInput, setNewPassInput] = useState("")
  var [confirmPassInput, setConfirmPassInput] = useState("")
  var [passwordOtpInput, setPasswordOtpInput] = useState("")
  var [passwordTimer, setPasswordTimer] = useState(0)

  useEffect(function () {
    fetchClothes().then(function (data) { setClothesData(data) }).catch(function () {})
    getOrders().then(function (data) { setOrders(data) }).catch(function () {})
  }, [])

  useEffect(() => {
    let interval = null;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval = null;
    if (passwordTimer > 0) {
      interval = setInterval(() => setPasswordTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [passwordTimer]);

  const formatTimer = (secs) => {
    if (secs <= 0) return "OTP expired, please resend";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `Expires in ${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendEmailOTP = async () => {
    if (!newEmailInput) return showMsg("Please enter a new email");
    try {
      await requestChangeEmailOTP(newEmailInput);
      setEmailFlowState(2);
      setEmailTimer(600); // 10 minutes
      showMsg("OTP sent to your current email");
    } catch (err) {
      showMsg(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (emailTimer <= 0) return showMsg("OTP expired, please resend");
    if (!emailOtpInput) return showMsg("Please enter OTP");
    try {
      const res = await verifyChangeEmail(emailOtpInput, newEmailInput);
      // Update local user state or force reload
      localStorage.setItem("token", res.token);
      showMsg("Email updated successfully! Please refresh.");
      setChangeEmailPopup(false);
      // Reset
      setEmailFlowState(1); setNewEmailInput(""); setEmailOtpInput(""); setEmailTimer(0);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showMsg(err.message || "Invalid OTP");
    }
  };

  const handleSendPasswordOTP = async () => {
    if (!currentPassInput || !newPassInput || !confirmPassInput) return showMsg("Please fill all fields");
    if (newPassInput !== confirmPassInput) return showMsg("New passwords do not match");
    try {
      await requestChangePasswordOTP();
      setPasswordFlowState(2);
      setPasswordTimer(600); // 10 minutes
      showMsg("OTP sent to your email");
    } catch (err) {
      showMsg(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyPasswordOTP = async () => {
    if (passwordTimer <= 0) return showMsg("OTP expired, please resend");
    if (!passwordOtpInput) return showMsg("Please enter OTP");
    try {
      await verifyChangePassword(passwordOtpInput, currentPassInput, newPassInput);
      showMsg("Password updated successfully!");
      setChangePasswordPopup(false);
      // Reset
      setPasswordFlowState(1); setCurrentPassInput(""); setNewPassInput(""); setConfirmPassInput(""); setPasswordOtpInput(""); setPasswordTimer(0);
    } catch (err) {
      showMsg(err.message || "Verification failed");
    }
  };

  var favItems = clothesData.filter(function (item) { return favourites.includes(item._id) })
  var allTabs = ["profile", "favourites", "orders", "settings"]

  function fmtDate(d) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  function getDeliveryStatus(item) {
    var now = new Date()
    var delivery = new Date(item.deliveryDate)
    var rentalEnd = new Date(item.rentalEndDate)
    var available = new Date(item.availableDate)
    var diffMs = delivery.getTime() - now.getTime()
    var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (now < delivery) {
      if (diffDays <= 0) return { text: "Out for delivery", color: "#e67e22", icon: "🚚" }
      return { text: "Delivery in " + diffDays + " day" + (diffDays > 1 ? "s" : ""), color: "#3498db", icon: "📦" }
    }
    if (now < rentalEnd) {
      var rentLeft = Math.ceil((rentalEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return { text: "Renting · " + rentLeft + " day" + (rentLeft > 1 ? "s" : "") + " left", color: "#27ae60", icon: "👕" }
    }
    if (now < available) {
      return { text: "Return in progress", color: "#e67e22", icon: "📤" }
    }
    return { text: "Completed", color: "#888", icon: "✅" }
  }

  return (
    <div className="account">
      <h1>My Account</h1>

      <div className="tabs">
        {allTabs.map(function (t) {
          return <button key={t} className={tab === t ? "active" : ""} onClick={function () { setTab(t) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        })}
      </div>

      {tab === "profile" && (
        <div className="section">
          <div className="profile-card">
            <div className="avatar">{user.name[0]}</div>
            <div><h3>{user.name}</h3><p style={{ color: '#888' }}>{user.email}</p></div>
          </div>
        </div>
      )}

      {tab === "favourites" && (
        <div className="section">
          <h2>Favourites</h2>
          {favItems.length === 0 ? <p className="empty">No favourites yet</p> : (
            <div className="fav-grid">
              {favItems.map(function (item) {
                return <ClothItem key={item._id} item={item} isFav={true} isInCart={false}
                  onFav={onToggleFav} onCart={function () {}} />
              })}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="section">
          <h2>Order History</h2>
          {orders.length === 0 ? <p className="empty">No orders yet</p> : (
            <div className="orders-list">
              {orders.map(function (order) {
                return (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span className="order-date">Ordered {fmtDate(order.checkoutDate)}</span>
                      <span className="order-total">₹{order.total}</span>
                    </div>
                    {order.renterLocationUrl && (
                      <p className="order-location">📍 Delivery to: <a href={order.renterLocationUrl} target="_blank" rel="noreferrer">Google Maps Link</a></p>
                    )}
                    <div className="order-items">
                      {order.items.map(function (item, i) {
                        var status = getDeliveryStatus(item)
                        return (
                          <div key={i} className="order-item-detail">
                            <div className="order-item-top">
                              <img src={item.image} alt={item.name} />
                              <div className="order-item-info">
                                <h4>{item.name}</h4>
                                <p>₹{item.price}/day × {item.days} day{item.days > 1 ? "s" : ""} = ₹{item.price * item.days}</p>
                                {item.distanceKm !== undefined && <p className="order-distance">{item.distanceKm} km away</p>}
                              </div>
                              <div className="order-status-badge" style={{ background: status.color }}>
                                {status.icon} {status.text}
                              </div>
                            </div>
                            <div className="order-timeline">
                              <div className="timeline-item">
                                <span className="timeline-label">Checkout</span>
                                <span>{fmtDate(order.checkoutDate)}</span>
                              </div>
                              <div className="timeline-arrow">→</div>
                              <div className="timeline-item">
                                <span className="timeline-label">Delivery</span>
                                <span>{fmtDate(item.deliveryDate)}</span>
                              </div>
                              <div className="timeline-arrow">→</div>
                              <div className="timeline-item">
                                <span className="timeline-label">Rental ends</span>
                                <span>{fmtDate(item.rentalEndDate)}</span>
                              </div>
                              <div className="timeline-arrow">→</div>
                              <div className="timeline-item">
                                <span className="timeline-label">Available</span>
                                <span>{fmtDate(item.availableDate)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="section settings-section">
          <div className="settings-header">
            <h2 className="settings-name">{user.name}</h2>
            <p className="settings-email">{user.email}</p>
          </div>
          <div className="settings-actions">
            <button className="btn-discord" onClick={() => { setChangeEmailPopup(true); setEmailFlowState(1); setNewEmailInput(""); }}>Change Email</button>
            <button className="btn-discord" onClick={() => { setChangePasswordPopup(true); setPasswordFlowState(1); setCurrentPassInput(""); setNewPassInput(""); setConfirmPassInput(""); }}>Change Password</button>
          </div>
        </div>
      )}

      <button className="btn btn-full btn-red" style={{ marginTop: '20px' }} onClick={onLogout}>Log Out</button>

      {changeEmailPopup && (
        <div className="popup-bg" onClick={(e) => { if (e.target.className === 'popup-bg') setChangeEmailPopup(false) }}>
          <div className="popup" style={{ maxWidth: '400px' }}>
            <button className="close-btn" onClick={() => setChangeEmailPopup(false)}>✕</button>
            <h2>Change Email</h2>
            {emailFlowState === 1 ? (
              <>
                <input placeholder="New Email" value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)} />
                <button className="btn btn-full" onClick={handleSendEmailOTP}>Send OTP</button>
              </>
            ) : (
              <>
                <p className={`timer-text ${emailTimer <= 0 ? 'expired' : ''}`}>{formatTimer(emailTimer)}</p>
                <input placeholder="Enter 6-digit OTP" value={emailOtpInput} onChange={(e) => setEmailOtpInput(e.target.value)} />
                {emailTimer <= 0 ? (
                  <button className="btn btn-full" onClick={handleSendEmailOTP}>Resend OTP</button>
                ) : (
                  <button className="btn btn-full" onClick={handleVerifyEmailOTP}>Verify OTP</button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {changePasswordPopup && (
        <div className="popup-bg" onClick={(e) => { if (e.target.className === 'popup-bg') setChangePasswordPopup(false) }}>
          <div className="popup" style={{ maxWidth: '400px' }}>
            <button className="close-btn" onClick={() => setChangePasswordPopup(false)}>✕</button>
            <h2>Change Password</h2>
            {passwordFlowState === 1 ? (
              <>
                <input type="password" placeholder="Current Password" value={currentPassInput} onChange={(e) => setCurrentPassInput(e.target.value)} />
                <input type="password" placeholder="New Password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} />
                <input type="password" placeholder="Confirm New Password" value={confirmPassInput} onChange={(e) => setConfirmPassInput(e.target.value)} />
                <button className="btn btn-full" onClick={handleSendPasswordOTP}>Send OTP</button>
              </>
            ) : (
              <>
                <p className={`timer-text ${passwordTimer <= 0 ? 'expired' : ''}`}>{formatTimer(passwordTimer)}</p>
                <input placeholder="Enter 6-digit OTP" value={passwordOtpInput} onChange={(e) => setPasswordOtpInput(e.target.value)} />
                {passwordTimer <= 0 ? (
                  <button className="btn btn-full" onClick={handleSendPasswordOTP}>Resend OTP</button>
                ) : (
                  <button className="btn btn-full" onClick={handleVerifyPasswordOTP}>Verify OTP</button>
                )}
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default Account
