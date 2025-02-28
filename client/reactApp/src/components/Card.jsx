// eslint-disable-next-line react/prop-types
function Card({ title, price, image, rating }) {
  return (
    <div className="max-w-xs rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 flex items-center bg-white text-black rounded-full px-2 py-1 shadow">
          <span className="text-sm mr-1">★</span>
          <span className="text-sm font-outfit font-medium">{rating}</span>
        </div>
      </div>

      <div className="bg-white p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-outfit font-semibold">{title}</h3>
          <p className="font-outfit text-blue-500">{price}</p>
        </div>
        <button className="font-outfit bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

export default Card;
