import heroBanner from '../assets/images/hero-banner.png'
import explore from '../assets/images/explore-fashion.png'
import sustainable from '../assets/images/sustainable-fashion.png'
import easy from '../assets/images/easy-rental.png'

function Home() {
  return (
    <div>
      <div className="hero">
        <img src={heroBanner} alt="Clothend" />
        <div className="hero-text">
          <h1>Rent Your Clothend</h1>
          <p>Affordable and sustainable fashion rental. Wear what you love.</p>
        </div>
      </div>

      <div className="promo">
        <img src={explore} alt="Explore" />
        <div>
          <h2>Explore Fashion</h2>
          <p>Browse hundreds of styles from casual tees to elegant blazers. Find your perfect outfit for any occasion.</p>
        </div>
      </div>

      <div className="promo reverse">
        <img src={sustainable} alt="Sustainable" />
        <div>
          <h2>Sustainable Renting</h2>
          <p>Reduce fashion waste by renting instead of buying. Join the movement towards eco-friendly fashion.</p>
        </div>
      </div>

      <div className="promo">
        <img src={easy} alt="Easy Rental" />
        <div>
          <h2>Easy Rental Process</h2>
          <p>Browse, pick your outfit, choose your duration, and we handle the rest. Fashion made simple.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
