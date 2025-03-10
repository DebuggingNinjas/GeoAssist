import Navbar from "./navbar";
import InputBar from "./InputBar";
import Filters from "./Filters";
import Card from "./Card";
import Footer from "./Footer";

function Hero() {
  return (
    <>
      <Navbar />

      <div className="hero-title">Discover Your Next Adventure</div>

      <div className="hero-subtitle">
        Explore handpicked destinations around the world
      </div>

      <div className="hero-input-container">
        <InputBar iconSize="text-md" width="w-full" />
      </div>

      <div className="hero-filters-container">
        <Filters />
      </div>

      <div className="hero-cards">
        <Card
          title="Toronto, ON"
          price="$2,500"
          rating={4.5}
          image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Card
          title="Toronto, ON"
          price="$2,500"
          rating={4.1}
          image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Card
          title="Toronto, ON"
          price="$2,500"
          rating={4.3}
          image="https://images.unsplash.com/photo-1507992781348-310259076fe0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>

      <div className="hero-cta">
        <div className="hero-cta-title">Ready to Start Your Journey?</div>
        <div className="hero-cta-subtitle">
          Explore handpicked destinations around the world
        </div>
        <div className="hero-subscribe">
          <span className="hero-subscribe-icon">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            type="email"
            placeholder="Enter your email"
            className="hero-subscribe-input"
          />
          <button className="hero-subscribe-button">Subscribe</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Hero;