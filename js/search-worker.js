'use strict';

importScripts('/js/lunr.min.js');

var index;
var data = [];

self.onmessage = function (message) {
    // var type = message.data.type;
    // var id = message.data.id;
    // var payload = message.data.payload;
    // switch (type) {
    //     case "load-index":
    //         loadIndex();
    //         break;
    //     case "query-index":
    //         self.postMessage({ type: type, id: id, payload: { query: payload, results: queryIndex(payload) } });
    //         break;
    //     default:
    //         self.postMessage({ type: type, id: id, payload: { error: 'invalid message type' } })
    // }

    if (message.data.type === "load-index") {
        loadIndex();
    } else if (message.data.type === "query-index") {
        self.postMessage({ type: "query-index", results: queryIndex(message.data.payload) });
    }
}

function loadIndex() {
    makeRequest("/search-data.json", function(array) {
        index = lunr(function() {
            this.ref("id");
            this.field("title", { boost: 10 });
            this.field("content");

            for (var i = 0; i < array.length; i++) {
                this.add(array[i]);
            }
        });

        console.log(index);
    });
}

function makeRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
        callback(JSON.parse(this.responseText));
    };
    request.open("GET", url);
    request.send();
}

// Query the index and return the processed results
function queryIndex(query) {
    try {
        if (query.length) {
            // // Add a relaxed search in the title for the first word in the query
            // // E.g. if the search is "ngCont guide" then we search for "ngCont guide titleWords:ngCont*"
            // var titleQuery = 'titleWords:*' + query.split(' ', 1)[0] + '*';
            // var results = index.search(query + ' ' + titleQuery);
            var results = index.search(query);
            console.log(results);
            // TODO
            // // Map the hits into info about each page to be returned as results
            //return results.map(function (hit) { return pages[hit.ref]; });
        }
    } catch (e) {
        // If the search query cannot be parsed the index throws an error
        // Log it and recover
        console.log(e);
    }
    return [];
}




// var SEARCH_TERMS_URL = '/generated/docs/app/search-data.json';

// importScripts('/js/lunr.min.js');

// var index;
// var pages = {};

// self.onmessage = function (message) {
//     var type = message.data.type;
//     var id = message.data.id;
//     var payload = message.data.payload;
//     switch (type) {
//         case 'load-index':
//             makeRequest(SEARCH_TERMS_URL, function (searchInfo) {
//                 index = createIndex(loadIndex(searchInfo));
//                 self.postMessage({ type: type, id: id, payload: true });
//             });
//             break;
//         case 'query-index':
//             self.postMessage({ type: type, id: id, payload: { query: payload, results: queryIndex(payload) } });
//             break;
//         default:
//             self.postMessage({ type: type, id: id, payload: { error: 'invalid message type' } })
//     }
// }

// // Create the lunr index - the docs should be an array of objects, each object containing
// // the path and search terms for a page
// function createIndex(addFn) {
//     return lunr(function () {
//         this.ref('path');
//         this.field('titleWords', { boost: 100 });
//         this.field('headingWords', { boost: 50 });
//         this.field('members', { boost: 40 });
//         this.field('keywords', { boost: 20 });
//         addFn(this);
//     });
// }


// // Create the search index from the searchInfo which contains the information about each page to be indexed
// function loadIndex(searchInfo) {
//     return function (index) {
//         // Store the pages data to be used in mapping query results back to pages
//         // Add search terms from each page to the search index
//         searchInfo.forEach(function (page) {
//             index.add(page);
//             pages[page.path] = page;
//         });
//     };
// }

// // Query the index and return the processed results
// function queryIndex(query) {
//     try {
//         if (query.length) {
//             // Add a relaxed search in the title for the first word in the query
//             // E.g. if the search is "ngCont guide" then we search for "ngCont guide titleWords:ngCont*"
//             var titleQuery = 'titleWords:*' + query.split(' ', 1)[0] + '*';
//             var results = index.search(query + ' ' + titleQuery);
//             // Map the hits into info about each page to be returned as results
//             return results.map(function (hit) { return pages[hit.ref]; });
//         }
//     } catch (e) {
//         // If the search query cannot be parsed the index throws an error
//         // Log it and recover
//         console.log(e);
//     }
//     return [];
// }
