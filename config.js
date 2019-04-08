const config = {}

if (process.env.NODE_ENV == 'development'){
    config.mongo = {};
    config.mongo.database = '';
    config.mongo.password = 'wicode2019'

    config.api = {};
    config.api.url = 'http://localhost:3000/';

    config.jwt = {};
    config.jwt.key = 'secret';

    config.mail = {}
    config.mail.username = 'knyokolodi@gmail.com';
    config.mail.password = 'Keos@89072018';
    config.mail.service = 'Gmail';
    config.mail.sendTo = 'knyokolodi@gmail.com';
    config.mail.port = 465;

}if(process.env.NODE_ENV == 'production'){
    config.mongo = {};
    config.mongo.database = '';
    config.mongo.password = 'wicode2019'

    config.api = {};
    config.api.url = 'https://wicode-api.herokuapp.com/';

    config.jwt = {};
    config.jwt.key = 'secret';

    config.mail = {}
    config.mail.username = 'knyokolodi@gmail.com';
    config.mail.password = 'Keos@89072018';
    config.mail.service = 'Gmail';
    config.mail.sendTo = 'knyokolodi@gmail.com';
    config.mail.port = 465;
}else{
    process.exit(console.log('No environment variable specified. Killing app now.'));
}

module.exports = config;
