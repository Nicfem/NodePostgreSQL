const nodemail = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemail.createTransport({
            host: process.env.SMTP_HOST, 
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_PASSWORD,
            to,
            subject: 'Привет',
            text: 'Привет, подтвердите почту',
            html: 
            `
                <div>
                    <h1>Активируйте!!</h1>
                    <a href="${link}" stype={color:red} >${link}</a>
                </div>
            `
        })
    }
}


module.exports = new MailService()