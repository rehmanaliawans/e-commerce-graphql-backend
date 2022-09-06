"use strict";

/**
 * order controller
 */
const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { amount, shippingAddress, city, state, pin, token, items } =
      ctx.request.body;
    await stripe.charges.create({
      amount: amount * 100,
      currency: "USD",
      source: token,
      description: `Order by user ${ctx.state.user.email}`,
    });
    const order = await strapi.db.query("api::order.order").create({
      data: {
        shippingAddress,
        amount,
        items,
        pin,
        city,
        state,
        user: ctx.state.user.email,
      },
    });
    return order;
  },
}));
