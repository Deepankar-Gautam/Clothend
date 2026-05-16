import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Account from './pages/Account'
import RentClothes from './pages/RentClothes'
import CartPage from './pages/CartPage'
import * as api from './api'

function App() {
  var navigate = useNavigate()
  var [user, setUser] = useState(null)
  var [cart, setCart] = useState([])
  var [favourites, setFavourites] = useState([])
  var [showLogin, setShowLogin] = useState(false)
  var [loginMode, setLoginMode] = useState("login")
  var [loginForm, setLoginForm] = useState({ name: "", email: "", password: "" })
  var [toast, setToast] = useState("")

  // Forgot Password Flow State
  var [showForgotPopup, setShowForgotPopup] = useState(false)
  var [forgotFlowState, setForgotFlowState] = useState(1) // 1: email, 2: OTP, 3: new pass
  var [forgotEmailInput, setForgotEmailInput] = useState("")
  var [forgotOtpInput, setForgotOtpInput] = useState("")
  var [forgotNewPassInput, setForgotNewPassInput] = useState("")
  var [forgotConfirmPassInput, setForgotConfirmPassInput] = useState("")
  var [forgotTimer, setForgotTimer] = useState(0)

  useEffect(() => {
    let interval = null;
    if (forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotTimer]);

  const formatTimer = (secs) => {
    if (secs <= 0) return "OTP expired, please resend";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `Expires in ${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleForgotSendOTP = async () => {
    if (!forgotEmailInput) return showMsg("Please enter email");
    try {
      await api.requestForgotPasswordOTP(forgotEmailInput);
      setForgotFlowState(2);
      setForgotTimer(600); // 10 minutes
      showMsg("OTP sent to your email");
    } catch (err) {
      showMsg(err.message || "Failed to send OTP");
    }
  };

  const handleForgotVerifyOTP = () => {
    if (forgotTimer <= 0) return showMsg("OTP expired, please resend");
    if (!forgotOtpInput) return showMsg("Please enter OTP");
    setForgotFlowState(3); // Move to password input state
  };

  const handleForgotDone = async () => {
    if (!forgotNewPassInput || !forgotConfirmPassInput) return showMsg("Please fill all fields");
    if (forgotNewPassInput !== forgotConfirmPassInput) return showMsg("Passwords do not match");
    try {
      var r = await api.resetPassword(forgotEmailInput, forgotOtpInput, forgotNewPassInput);
      localStorage.setItem("token", r.token); setUser(r.user); 
      setShowForgotPopup(false);
      // Reset
      setForgotFlowState(1); setForgotEmailInput(""); setForgotOtpInput(""); setForgotNewPassInput(""); setForgotConfirmPassInput(""); setForgotTimer(0);
      showMsg("Password reset successfully");
      var c = await api.getCart(); setCart(c);
      var f = await api.getFavourites(); setFavourites(f);
    } catch (err) {
      showMsg(err.message || "Reset failed");
    }
  };
  useEffect(function () {
    var token = localStorage.getItem("token")
    if (token) {
      api.fetchMe()
        .then(function (u) { setUser(u); return Promise.all([api.getCart(), api.getFavourites()]) })
        .then(function (r) { setCart(r[0]); setFavourites(r[1]) })
        .catch(function () { localStorage.removeItem("token") })
    }
  }, [])

  function showMsg(msg) { setToast(msg); setTimeout(function () { setToast("") }, 2000) }

  async function toggleFav(id) {
    if (!user) { setShowLogin(true); return }
    try {
      var r = await api.toggleFavouriteAPI(id)
      setFavourites(r.clothIds)
      showMsg(r.action === "added" ? "Added to Favourites" : "Removed from Favourites")
    } catch (err) { showMsg(err.message) }
  }

  async function addToCart(item, days) {
    if (!user) { setShowLogin(true); return }
    if (item.available === false) { return showMsg("This item is currently unavailable") }
    try {
      var updated = await api.addToCartAPI(item, days)
      setCart(updated)
      showMsg("Added to Cart")
    } catch (err) { showMsg(err.message) }
  }

  async function removeFromCart(i) {
    try { var updated = await api.removeFromCartAPI(i); setCart(updated); showMsg("Removed from Cart") }
    catch (err) { showMsg(err.message) }
  }

  async function updateCartDays(index, days) {
    try { var updated = await api.updateCartDaysAPI(index, days); setCart(updated) }
    catch (err) { showMsg(err.message) }
  }

  async function handleLogin() {
    if (!loginForm.email || !loginForm.password) return showMsg("Fill all fields")
    if (loginMode === "signup" && !loginForm.name) return showMsg("Fill all fields")
    try {
      var r = loginMode === "signup"
        ? await api.signup(loginForm.name, loginForm.email, loginForm.password)
        : await api.login(loginForm.email, loginForm.password)
      localStorage.setItem("token", r.token); setUser(r.user); setShowLogin(false)
      setLoginForm({ name: "", email: "", password: "" }); showMsg("Logged in!")
      var c = await api.getCart(); setCart(c)
      var f = await api.getFavourites(); setFavourites(f)
    } catch (err) { showMsg(err.message) }
  }

  function handleLogout() {
    setUser(null); setCart([]); setFavourites([]); localStorage.removeItem("token"); showMsg("Logged out!"); navigate("/")
  }

  async function handleCheckout(renterLocationUrl) {
    try {
      await api.checkout(renterLocationUrl)
      setCart([])
      showMsg("Order placed successfully!")
    } catch (err) { showMsg(err.message) }
  }

  return (
    <div>
      <Navbar user={user} cartCount={cart.length} onAccountClick={function () { setShowLogin(true) }} />
      {toast && <div className="toast">{toast}</div>}

      {showLogin && (
        <div className="popup-bg" onClick={function () { setShowLogin(false) }}>
          <div className="popup" onClick={function (e) { e.stopPropagation() }}>
            <button className="close-btn" onClick={function () { setShowLogin(false) }}>✕</button>
            <h2>{loginMode === "login" ? "Log In" : "Sign Up"}</h2>
            {loginMode === "signup" && (
              <input placeholder="Name" value={loginForm.name}
                onChange={function (e) { setLoginForm({ ...loginForm, name: e.target.value }) }} />
            )}
            <input placeholder="Email" value={loginForm.email}
              onChange={function (e) { setLoginForm({ ...loginForm, email: e.target.value }) }} />
            <input type="password" placeholder="Password" value={loginForm.password}
              onChange={function (e) { setLoginForm({ ...loginForm, password: e.target.value }) }} />
            <button className="btn btn-full" onClick={handleLogin}>
              {loginMode === "login" ? "Log In" : "Sign Up"}
            </button>
            <button className="btn-link" onClick={function () { setLoginMode(loginMode === "login" ? "signup" : "login") }}>
              {loginMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
            {loginMode === "login" && (
              <button className="btn-link" onClick={() => { setShowLogin(false); setShowForgotPopup(true); setForgotFlowState(1); setForgotEmailInput(""); }}>
                Forgot Password?
              </button>
            )}
          </div>
        </div>
      )}

      {showForgotPopup && (
        <div className="popup-bg" onClick={(e) => { if (e.target.className === 'popup-bg') setShowForgotPopup(false) }}>
          <div className="popup" style={{ maxWidth: '400px' }}>
            <button className="close-btn" onClick={() => setShowForgotPopup(false)}>✕</button>
            <h2>Forgot Password</h2>
            {forgotFlowState === 1 && (
              <>
                <input placeholder="Enter your email" value={forgotEmailInput} onChange={(e) => setForgotEmailInput(e.target.value)} />
                <button className="btn btn-full" onClick={handleForgotSendOTP}>Send OTP</button>
              </>
            )}
            {forgotFlowState === 2 && (
              <>
                <p className={`timer-text ${forgotTimer <= 0 ? 'expired' : ''}`}>{formatTimer(forgotTimer)}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input style={{ flex: 1, margin: 0 }} placeholder="Enter 6-digit OTP" value={forgotOtpInput} onChange={(e) => setForgotOtpInput(e.target.value)} />
                  {forgotTimer <= 0 ? (
                    <button className="btn" onClick={handleForgotSendOTP}>Resend OTP</button>
                  ) : (
                    <button className="btn" onClick={handleForgotVerifyOTP}>Verify OTP</button>
                  )}
                </div>
              </>
            )}
            {forgotFlowState === 3 && (
              <>
                <input type="password" placeholder="New Password" value={forgotNewPassInput} onChange={(e) => setForgotNewPassInput(e.target.value)} />
                <input type="password" placeholder="Confirm New Password" value={forgotConfirmPassInput} onChange={(e) => setForgotConfirmPassInput(e.target.value)} />
                <button className="btn btn-full" onClick={handleForgotDone}>Done</button>
              </>
            )}
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse favourites={favourites} cart={cart} onToggleFav={toggleFav} onAddCart={addToCart} />} />
        <Route path="/rent" element={<RentClothes user={user} showMsg={showMsg} onShowLogin={function () { setShowLogin(true) }} />} />
        <Route path="/cart" element={
          user
            ? <CartPage cart={cart} onRemoveCart={removeFromCart} onUpdateDays={updateCartDays} onCheckout={handleCheckout} showMsg={showMsg} />
            : <div className="center-msg"><p>Please log in to view your cart</p>
              <button className="btn" onClick={function () { setShowLogin(true) }}>Log In</button></div>
        } />
        <Route path="/account" element={
          user
            ? <Account user={user} favourites={favourites} onToggleFav={toggleFav} onLogout={handleLogout} showMsg={showMsg} />
            : <div className="center-msg"><p>Please log in first</p>
              <button className="btn" onClick={function () { setShowLogin(true) }}>Log In</button></div>
        } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
