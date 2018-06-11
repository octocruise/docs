// Adapted from https://lunrjs.com/guides/index_prebuilding.html

var lunr = require("../js/lunr.min.js"),
    stdin = process.stdin,
    stdout = process.stdout,
    buffer = [];

stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", function (data) {
    buffer.push(data);
});

stdin.on("end", function () {
    var data = JSON.parse(buffer.join(""));

    var idx = lunr(function () {
        this.ref("ref");
        this.field("title", { boost: 10 });
        this.field("content");

        for (var key in data) {
            var item = data[key];
            if (item.title || item.content) {
                this.add({
                    ref: key + "|" + item.title,
                    title: item.title,
                    content: item.content
                });
            }
        }
    })

    stdout.write(JSON.stringify(idx));
});
