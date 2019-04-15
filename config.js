const config = {}
    config.mongo = {};
    config.mongo.database = '';
    config.mongo.password = 'wicode2019'

    config.api = {};
    config.api.url = 'https://wicode-api.herokuapp.com/';

    config.jwt = {};
    config.jwt.key = 'secret';

    config.mail = {}
    config.mail.username = 'knyokolodi@gmail.com';
    config.mail.password = '2019@Keos';
    config.mail.service = 'Gmail';
    config.mail.sendTo = 'knyokolodi@gmail.com';
    config.mail.port = 465;
module.exports = config;
