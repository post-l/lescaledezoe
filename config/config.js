module.exports = {
    development: {
        db: 'mongodb://localhost/croquerlemonde',
        app: {
            name: 'L\'Escale de Zoe',
            secretKey: 'blue bird 42 is the key'
        },
        facebook: {
            clientID: "{{PLACEHOLDER}}",
            clientSecret: "{{PLACEHOLDER}}",
            callbackURL: "{{PLACEHOLDER}}"
        },
        google: {
            clientID: "{{PLACEHOLDER}}",
            clientSecret: "{{PLACEHOLDER}}",
            callbackURL: "{{PLACEHOLDER}}"
        }
    },
    production: {
        db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
        app: {
            name: 'L\'Escale de Zoe',
            secretKey: 'blue bird 42 is the key'
        },
        facebook: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        },
        google: {
            clientID: '',
            clientSecret: '',
            callbackURL: ''
        }
    }
};
