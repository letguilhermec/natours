<a name="readme-top" id="readme-top"></a>
<h1 align="center">
  <a href="https://github.com/letguilhermec/natours">
    <img src="public/img/logo-green-round.png" alt="Logo" width="125" height="125">
  </a>
</h1>

<img src="public/img/homepage.jpg" alt="Homepage Example">

<div align="center">
  <br />
  <h1>Natours website!</h1>
  <br />
  <br />
  <h2>Live at: 
  <div align="center">
  <br />

[![Website](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://natours-g.herokuapp.com/)
</div>
</h2>
</div>



<div align="center">
<br />

[![license](https://img.shields.io/github/license/letguilhermec/natours?style=for-the-badge)](LICENSE)

[![made with hearth by letguilhermec](https://img.shields.io/badge/made%20with%20%E2%99%A5%20by-letguilhermec-ff1414.svg?style=for-the-badge)](https://github.com/letguilhermec)

![GitHub repo size](https://img.shields.io/github/repo-size/letguilhermec/natours?style=for-the-badge)

![GitHub language count](https://img.shields.io/github/languages/count/letguilhermec/natours?style=for-the-badge)
![](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![](https://img.shields.io/badge/Pug-EA2328?style=for-the-badge&logo=couchbase&logoColor=white)
<br />
<br />
<br />
</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
- [Built With](#built-with)
- [Future improvements](#future-improvements)
- [License](#license)
- [API Documentation](#api-documentation)

</details>

---

## About

<table>
<tr>
<td>

  The early stages of a tour selling company website.

<details open>
<summary>Additional info</summary>
<br>

  This project is the result of taking Jonas Schmedtmann's ["Node.js, Express, MondoDB & More..."] [![Udemy](https://img.shields.io/badge/Udemy-EC5252?logo=Udemy&logoColor=white)](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) course. 
  
  The back-end is coded in Node.js using Express and MongoDB. The API docs can be visualized below.
  
  The front-end was, as of now, entirely made out of .pug templates.
  
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

</td>
</tr>
</table>

## Built With

- [Pug](https://github.com/pugjs/pug)
- [Express](https://github.com/expressjs/express)
- [MongoDB](https://github.com/mongodb/mongo)
- [Mongoose](https://github.com/Automattic/mongoose)
- [axios](https://github.com/axios/axios)
- [Stripe Node.js Library](https://github.com/stripe/stripe-node)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Future improvements

The project is still in development and the future updates will be guided by the following tasks / improvements:

- [ ] Implementing a Sign Up form
- [ ] Users can only review a Tour that they have actually booked
  - [ ] It includes verifying if the Tour date has already passed
- [ ] Nested Booking routes (/tours/:id/bookings) and (/users/:id/bookings)
- [ ] Date as instances of a Tour (each containing a 'participants' and 'soldOut' fields)
  - [ ] That way, when a user books a Tour, they must select one of the available dates
  - [ ] A new Booking increases the number of participants in the 'date' field until it is fully booked (partipants === maxGroupSize)
- [ ] Implementing advanced authentication features, such as confirming user e-mail address, two-factor authentication, refresh tokens...
- [ ] Adding a review directly from the Tour page
  - [ ] If the logged in user has booked that specific Tour and the Tour date has passed)
- [ ] Hiding the Booking section if the logged in user has already booked that Tour
  - [ ] For the booked date, at least
- [ ] Implementing a "like Tour" functionality (wish-list)
  - [ ] Favorites panel in Account page
- [ ] Implementing 'My Reviews' Page
- [ ] Implementing Admin pages w/ CRUD operations for managing Users, Tours, Reviews and Bookings

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## License

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE.txt) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## API Documentation

See [API Docs](Natours.postman_collection.json) _or_ a live version at [Postman](https://documenter.getpostman.com/view/18687173/VUxPvSq6).

<p align="right">(<a href="#readme-top">back to top</a>)</p>