const net = require('net');

const port = 38122;
const host = 'localhost';

// Create a new socket
const socket = new net.Socket();

// Establish a TCP connection
socket.connect(port, host);

// A Tor control protocol
// https://gitweb.torproject.org/torspec.git/tree/control-spec.txt

socket.on('connect', () => {
    console.log(`Established a TCP connection with ${host}:${port}`);

    socket.write('AUTHENTICATE\n');
    socket.write('PROTOCOLINFO 1\n');

    // Available Tor's circuits
    socket.write('GETINFO circuit-status\n');

    socket.write('setevents circ stream orconn');
    //   socket.destroy();
});

socket.on('data', data => {
    // data is an array buffer. We need to transform it to string
    console.log('data', data.toString());

    // Close the connection
    // socket.destroy();
});

socket.on('close', data => {
    console.log('close', data.toString());
});

socket.on('error', data => {
    console.log('error', data.toString());

    // Close the connection
    // socket.destroy();
});