const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Natours Website <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //  Sendgrid
      return nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
          user: process.env.P_EMAIL_USER,
          pass: process.env.P_EMAIL_PASSWORD
        }
      })
    }
    //  Mailtrap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }

  async send(template, subject) {
    //  Render HTML for email based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    )

    //  Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    }

    //  Create a transport and send the email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours!')
  }

  async sendReset() {
    await this.send(
      'passwordReset',
      'Forgot your password? Here is your password token (valid for 10 minutes)'
    )
  }
}
