function Card({ title, price, image, rating }) {
    return (
      <div className="card">
        <div className="card-image-container">
          <img src={image} alt={title} className="card-image" />
          <div className="card-rating">
            <span className="card-rating-star">★</span>
            <span className="card-rating-value">{rating}</span>
          </div>
        </div>
  
        <div className="card-content">
          <div>
            <h3 className="card-title">{title}</h3>
            <p className="card-price">{price}</p>
          </div>
          <button className="card-button">View Details</button>
        </div>
      </div>
    );
  }
  
  export default Card;