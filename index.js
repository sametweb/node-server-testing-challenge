const server = require("./server");

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

module.exports = server;
