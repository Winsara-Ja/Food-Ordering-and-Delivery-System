import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import { toast } from "react-hot-toast";
import Header from "./Header";

const Menu = () => {
  const userID = "663b79ac751b61805e4a1a03";
  const [items, setItems] = useState([]);
  const [Quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((items) => setItems(items.data))
      .catch((err) => console.log(err));
  }, []);

  const AddToCart = async (item) => {
    const { _id, itemName, Description, Price, RestaurantID } = item;
    try {
      await axios.post("http://localhost:5000/addtocart", {
        userID,
        _id,
        RestaurantID,
        itemName,
        Description,
        Quantity,
        Price,
      });
      if (item.error) {
        toast.error(item.error);
      } else {
        toast.success("Item Added To The Cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="menuItems">MENU ITEMS</div>
      <div>
        {items.map((item) => {
          return (
            <>
              <div className="wrapper">
                <div className="product-info">
                  <div className="product-text">
                    <h1>{item.itemName}</h1>
                    <h2>{item._id}</h2>
                    <h2 className="hidden">{item.RestaurantID}</h2>
                  </div>
                  <div className="img">
                    <img src="pancakes_img.jpg" />
                  </div>
                  <div className="product-text2">
                    <p>{item.Description}</p>
                  </div>
                  <div className="price">Rs.{item.Price}</div>
                  <div className="product-price-btn">
                    <button type="button" onClick={() => AddToCart(item)}>
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default Menu;
