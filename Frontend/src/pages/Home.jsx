import React from "react";
import backgroundImage from "../assets/bg1.jpg";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  return (
    <div className="w-full">
      {/* Background Hero Section */}
      <div
        className="relative h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Navbar />
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-6">WELCOME TO THE ......</h1>
          <p className="text-lg mb-8 max-w-xl">
          Craving something delicious? The ...... brings your favorite meals from top local restaurants right to your doorstep. Enjoy fast, reliable delivery, 
          real-time order tracking, and exclusive deals—all in one. Whether it's breakfast, lunch, dinner, or a late-night snack, we've got you covered.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded text-white font-semibold">
            ORDER ONLINE
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="py-16 px-4 bg-gray-100 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full max-w-7xl text-black">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://kidseatfree.io/wp-content/uploads/2023/12/kids-eat-free-meal.png"
              alt="Feed Employees"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Verify with us</h3>
            <Link to="/business-account" className="text-orange-600 underline">
              Verify your restaurant
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://images.pexels.com/photos/9907957/pexels-photo-9907957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Request Dashboard"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Get Access to Dashboard</h3>
            <Link to="/request-dashboard" className="text-orange-600 underline">
              Request Dashboard Access
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://thumbs.dreamstime.com/b/sunny-day-delightful-small-grocery-store-exterior-shop-front-view-food-cozy-urban-scene-drink-retail-market-charming-small-grocery-363241332.jpg"
              alt="Add Restaurant"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Your restaurant, delivered</h3>
            <Link to="/add-restaurant" className="text-orange-600 underline">
              Add your restaurant
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://c.ndtvimg.com/2024-11/bpp32sd_food-delivery-agent-stock-photo_625x300_25_November_24.jpg?im=FaceCrop,algorithm=dnn"
              alt="Deliver"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Deliver with The Irish Cafe</h3>
            <Link to="/deliver" className="text-orange-600 underline">
              Sign up to deliver
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-16 lg:px-24 pb-30">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white rounded-3xl shadow-2xl p-6 mt-10">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">Track your food to your doorstep</h2>
            <p className="text-gray-700 text-base mb-4">
              Stay in the loop with real-time tracking. Watch your delivery on the map, get notified when it's picked up, and be ready when your rider is nearby.
            </p>
            <div className="flex gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/800px-Download_on_the_App_Store_RGB_blk.svg.png" alt="Download on App Store" className="h-10" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <img src="https://www.shutterstock.com/image-vector/gps-tracking-map-abstract-isometric-600nw-2379614635.jpg" alt="Delivery Route" className="rounded-xl w-full" />
            
            {/* Notification Card */}
            <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-xl shadow-md p-4 w-64 z-10">
              <div className="flex items-center mb-2">
                <span className="font-semibold">Your rider’s nearby 🎉</span>
              </div>
              <p className="text-sm text-gray-600">They’re almost there – get ready!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-20 lg:px-24 mb-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000, // time between slides in ms
          disableOnInteraction: false, // keep autoplay even after user interacts
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="px-4 sm:px-8 md:px-16 lg:px-24 pb-10"
      >
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color:rgb(10, 10, 10); /* Tailwind orange-500 */
          }
        `}
      </style>

        {/* Slide 1 */}
        <SwiperSlide>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/food-delivery-design-template-eaf8ef08673fe3f7a195ad2722294d2f_screen.jpg?ts=1696418371" className="w-full h-98 object-cover" alt="Dish 1" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Delicious Meals to Your Doorstep</h3>
              <div className="w-10 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm mb-4">
              Craving your favorite dish? Skip the queue and get freshly prepared meals delivered hot and fast — right to your home. 
              Taste the comfort with every bite!
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src="https://pbs.twimg.com/media/GDTLRatXUAAnDXj?format=jpg&name=4096x4096" className="w-full h-98 object-cover" alt="Dish 2" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Limited-Time Flash Discounts</h3>
              <div className="w-10 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm mb-4">
              Hurry up! Grab these flash deals before they disappear. Enjoy additional savings on select menus, available only for a short window. 
              Order now and take advantage!
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img src="https://cheesecakedelights.in/wp-content/uploads/2021/06/CD-Blog-First-Order-Offer-Rev.png" className="w-full h-98 object-cover" alt="Dish 3" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Enjoy 20% Off on Your First Order</h3>
              <div className="w-10 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm mb-4">
              First-time users get 20% off on their first meal delivery! Use code **WELCOME20** at checkout.Order now and take advantage!
              </p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4 */}
        <SwiperSlide>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/happy-weekend-offers-design-template-e8f9d5ddb905994b7108cef761c1e4b5_screen.jpg?ts=1698822904" className="w-full h-98 object-cover" alt="Dish 3" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Weekend Special - Buy One, Get One Free</h3>
              <div className="w-10 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 text-sm mb-4">
              This weekend, enjoy our BOGO offer! Order one meal and get another absolutely free. Don't miss out!Hurry up! Grab these flash deals before they disappear.
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      </div>


      <Footer />
    </div>
  );
};

export default Home;
