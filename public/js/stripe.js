import axios from 'axios'
import { showAlert } from './alerts'

const stripe = Stripe(
  'pk_test_51Lg8xrFdWMkD89H77r7pTrH6NSttsOJrAU56G7IuKXkD1IlrHyy8CxplB8VhTxZTGIcp6A3rgnlKVy2gc4qhZbs000gypqmqHH'
)

export const bookTour = async tourId => {
  try {
    //  Get session from server
    const session = await axios(`api/v1/bookings/checkout-session/${tourId}`)

    //  Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err)
    showAlert('error', err)
  }

}
