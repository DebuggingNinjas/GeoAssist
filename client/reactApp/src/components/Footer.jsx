function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h2 className="footer-brand">GeoAssist</h2>
            <p className="footer-tagline">Your gateway to extraordinary adventures</p>
          </div>
  
          <div>
            <h3 className="footer-heading">Destinations</h3>
            <ul className="footer-list">
              <li>Popular</li>
              <li>Trending</li>
              <li>New Arrivals</li>
            </ul>
          </div>
  
          <div>
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-list">
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>
  
          <div>
            <h3 className="footer-heading">Follow Us</h3>
            <div className="footer-social">
              <i className="fab fa-instagram footer-social-icon"></i>
              <i className="fab fa-twitter footer-social-icon"></i>
              <i className="fab fa-facebook footer-social-icon"></i>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;