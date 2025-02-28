function Footer() {
  return (
    <footer className="bg-[#1F2937] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-2xl font-semibold text-white">GeoAssist</h2>
          <p className="mt-2 text-sm">
            Your gateway to extraordinary adventures
          </p>
        </div>

        {/* Destinations */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">
            Destinations
          </h3>
          <ul className="space-y-2">
            <li>Popular</li>
            <li>Trending</li>
            <li>New Arrivals</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4">
            <i className="fab fa-instagram hover:text-white"></i>
            <i className="fab fa-twitter hover:text-white"></i>
            <i className="fab fa-facebook hover:text-white"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
