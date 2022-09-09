const stripe = require('stripe')(process.env.STRIPE_KEY)
const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utils/catchAsync')
const { createOne, deleteOne, updateOne, getOne, getAll } = require('./handlerFactory')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //  Get currently booked tourModel
  const tour = await Tour.findById(req.params.tourId)

  //  Create chekout checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary
            //images: []
          },
          unit_amount: tour.price * 100,
          currency: 'usd'
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  })

  //  Create session as response
  res.status(200).json({
    status: 'success',
    session
  })
})

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //  Temporary => Users could book tours without paying for them
  const { tour, user, price } = req.query
  if (!tour && !user && !price) return next()

  await Booking.create({ tour, user, price })

  res.redirect(req.originalUrl.split('?')[0])
})

exports.createBooking = createOne(Booking)
exports.getBooking = getOne(Booking)
exports.getAllBookings = getAll(Booking)
exports.updateBooking = updateOne(Booking)
exports.deleteBooking = deleteOne(Booking)
