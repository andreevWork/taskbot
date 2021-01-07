module.exports = function createHttpServer() {
    const page = require("fs").readFileSync(
        require("path").resolve(__dirname, "./bot_main_page.html")
    );

    require("http")
        .createServer(function (request, response) {
            response.writeHeader(200, {
                "Content-Type": "text/html",
                "Content-length": page.length,
                "Cache-Control":
                    "max-age=86400, stale-while-revalidate=2592000",
            });
            response.write(page);
            response.end();
        })
        .listen(process.env.PORT, "0.0.0.0");
};
