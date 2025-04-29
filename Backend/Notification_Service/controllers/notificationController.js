const nodemailer = require('nodemailer');
const axios = require('axios');

exports.sendOrderConfirmation = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // 1. Fetch user data from user-management service
    const userRes = await axios.get(`http://localhost:4000/api/auth/user/${userId}`);
    const user = userRes.data;
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found.' });
    }

    // 2. Fetch order details from order service
    const orderRes = await axios.get(`http://localhost:5000/orders/${orderId}`);
    const order = orderRes.data;
    if (!order) {
      return res.status(400).json({ message: 'Order not found.' });
    }

    // 3. Prepare HTML for each item as a card
    const itemsHtml = order.ItemData.map(item => `
      <div style="border:1px solid #e0e0e0; border-radius:8px; margin-bottom:16px; padding:16px; display:flex; align-items:center; background:#fafbfc;">
        <img src="${item.Image}" alt="${item.ItemName}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; margin-right:16px;">
        <div style="flex:1;">
          <h4 style="margin:0 0 8px 0; color:#2e6da4;">${item.ItemName}</h4>
          <p style="margin:0; color:#444;">Quantity: <b>${item.Quantity}</b></p>
          <p style="margin:0; color:#444;">Unit Price: <b>${item.ItemPrice.toFixed(2)} LKR</b></p>
          <p style="margin:0; color:#444;">Total: <b>${(item.ItemPrice * item.Quantity).toFixed(2)} LKR</b></p>
        </div>
      </div>
    `).join('');

    // 4. Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Your Order Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 700px; margin: auto;">
          <h2 style="color: #2e6da4;">🍽️ Order Confirmation</h2>
          <p>Hi <strong>${user.username || 'there'}</strong>,</p>
          <p>Thank you for your order from <b>${order.RestaurantName}</b>! We're preparing it with care. 🧑‍🍳</p>

          <h3 style="margin-top: 30px; margin-bottom: 10px; color: #2e6da4;">🧾 Order Details</h3>
          ${itemsHtml}

          <p style="font-size: 1.1em; margin-top:24px;"><strong>Total:</strong> <span style="color: #2e6da4;">${order.TotalPrice.toFixed(2)} LKR</span></p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Placed At:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

          <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email. We're happy to help!</p>
          <p style="color: #888; font-size: 12px;">This is an automated email. Please do not reply to it directly.</p>
        </div>
      `,
    });

    return res.json({ message: 'Order confirmation email sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};



exports.sendOrderConfirmationToDriver = async (req, res) => {
  const { userId, orderId, address } = req.body;

  try {
    // 1. Fetch user data
    const userRes = await axios.get(`http://localhost:4000/api/auth/user/${userId}`);
    const user = userRes.data;
    if (!user || !user.username) {
      return res.status(400).json({ message: 'User username not found.' });
    }

    // 2. Fetch order details
    const orderRes = await axios.get(`http://localhost:5000/orders/${orderId}`);
    const order = orderRes.data;
    if (!order || !order.RestaurantID) {
      return res.status(400).json({ message: 'Order or RestaurantID not found.' });
    }

    // 3. Fetch restaurant details
    const restaurantRes = await axios.get(`http://localhost:4000/api/restaurants/res/${order.RestaurantID}`);
    const restaurant = restaurantRes.data;
    if (!restaurant || !restaurant.address) {
      return res.status(400).json({ message: 'Restaurant address not found.' });
    }

    // 4. Prepare HTML body
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #222; padding: 24px; max-width: 700px; margin: auto; background: #f9fbfc;">
      <h2 style="color: #2e6da4; margin-bottom: 24px;">🚗 New Order Assignment</h2>
      
      <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 24px 20px 18px 20px; margin-bottom: 24px;">
        <div style="font-size: 1.1em; margin-bottom: 12px; color: #333;">
          <span style="font-family: 'Roboto Mono', monospace; font-size: 1.7em; font-weight: bold; color: #1a237e; letter-spacing: 1px; background: #e3e6f3; padding: 8px 22px; border-radius: 10px; display: inline-block;">
            Order ID: ${order._id}
          </span>
        </div>
        <div style="margin-bottom: 8px;">
          <b>Placed At:</b> ${new Date(order.createdAt).toLocaleString()}
        </div>
      </div>
      
      <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 24px 20px 18px 20px; margin-bottom: 24px; display: flex; align-items: center;">
        <img src="${restaurant.logoUrl || 'https://via.placeholder.com/80x80?text=Logo'}" alt="Restaurant Logo" style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover; margin-right: 22px; border: 1px solid #e0e0e0;">
        <div>
          <div style="font-size: 1.25em; font-weight: bold; color: #2e6da4; margin-bottom: 6px;">${order.RestaurantName}</div>
          <div style="color: #555; margin-bottom: 4px;"><b>Restaurant ID:</b> ${order.RestaurantID}</div>
          <div style="margin-top: 8px; background: #e8f0fe; border-radius: 8px; padding: 10px 16px;">
            <span style="font-size: 1.25em; font-weight: bold; color: #0d47a1;">Restaurant Address:</span>
            <div style="font-size: 1.18em; color: #263238; margin-top: 6px; font-weight: bold;">
              ${restaurant.address}
            </div>
          </div>
        </div>
      </div>
      
      <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e0e0e0; padding: 24px 20px 18px 20px; margin-bottom: 24px;">
        <div style="font-size: 1.22em; font-weight: bold; color: #388e3c; margin-bottom: 8px;">Delivery Address</div>
        <div style="margin-top: 8px; background: #fffde7; border-radius: 8px; padding: 10px 16px;">
          <div style="font-size: 1.18em; color: #263238; font-weight: bold;">
            ${address}
          </div>
          <div style="font-size: 1.08em; color: #666; margin-top: 6px;">
            <b>Recipient:</b> ${user.username}
          </div>
        </div>
      </div>
      
      <div style="margin-top: 30px; color: #444; font-size: 1.08em;">
        Please pick up the order from the restaurant and deliver it to the address above.
      </div>
      <p style="color: #888; font-size: 12px; margin-top: 28px;">This is an automated email. Please do not reply to it directly.</p>
    </div>
  `;


    // 5. Send email (for testing, use your own email)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // For testing, send to yourself
      subject: 'New Order Assignment',
      html: htmlBody,
    });

    return res.json({ message: 'Order confirmation sent to driver.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};
