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
    const orderRes = await axios.get(`http://localhost:5001/orders/${orderId}`);
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
