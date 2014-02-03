module.exports = {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/lescaledezoe',
    app: {
        name: 'L\'Escale de Zoe',
        secretKey: process.env.SECRETKEY
    },
    facebook: {
        clientID: process.env.FB_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: 'http://lescaledezoe.com/auth/facebook/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'http://lescaledezoe.com/auth/google/callback'
    },
    gmailAuth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD
    },
    madmimi: {
        email: process.env.MADMIMI_MAIL,
        api_key: process.env.MADMIMI_API_KEY
    },
    paypal: {
        'host': 'api.sandbox.paypal.com',
        'port': '',
        'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
        'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
    }
};
