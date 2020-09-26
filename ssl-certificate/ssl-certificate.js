module.exports = function(RED) {
    "use strict";
    var sslCertificate = require('get-ssl-certificate');

    function SslCertificateNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.server = config.server;
        node.port = config.port;
        node.timeout = config.timeout;

        node.on('input', function(msg, send, done) {
            let server = node.server || msg.server;
            let port = node.port || msg.port || 443;
            let timeout = node.timeout || 300;

            if (!server) {
                done(new Error("No server specified"));
            }

            sslCertificate.get(server, timeout, port).then(function (certificate) {
                msg.payload = certificate;
                msg.valid_from = new Date(certificate.valid_from);
                msg.valid_to = new Date(certificate.valid_to);
                msg.server = server;
                msg.port = port;

                send(msg);
                if (done) {
                    done();
                }
            });
        });
    }
    RED.nodes.registerType("ssl-certificate", SslCertificateNode);
}
