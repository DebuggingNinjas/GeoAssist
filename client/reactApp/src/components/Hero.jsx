import Navbar from "./Navbar";
import InputBar from "./InputBar";
import Filters from "./Filters";
import Card from "./Card";
import Footer from "./Footer";

function Hero() {
  return (
    <>
      <Navbar />

      <div className="text-5xl font-semibold font-outfit text-center">
        Discover Your Next Adventure
      </div>

      <div className="text-lg font-outfit text-center text-[#4B5563] opacity-65 pb-10">
        Explore handpicked destinations around the world
      </div>

      <div className="flex justify-center pb-10">
        <InputBar iconSize="text-md" width="w-full" />
      </div>

      <div className="flex justify-center py-5">
        <Filters />
      </div>

      <div className="grid grid-cols-3 gap-4 w-4/5 mx-auto pb-20">
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

      <div className="w-full py-5">
        <div className="text-5xl pb-2 font-semibold font-outfit text-center">
          Ready to Start Your Journey?
        </div>
        <div className="text-lg font-outfit text-center text-[#4B5563] opacity-65 pb-10">
          Explore handpicked destinations around the world
        </div>
        <div className="flex w-full max-w-xl mb-10 mx-auto items-center border border-gray-300 rounded-md overflow-hidden bg-white">
          <span className="pl-3 text-gray-400">
            <i className="fas fa-envelope"></i>
          </span>

          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
          />

          <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Hero;
