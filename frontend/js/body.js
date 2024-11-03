// $(document).ready(function() {
//     // Load firm.html when the entreprise-link is clicked
//     $("#entreprise-link").on("click", function() {
//         $("main").load("html/firm.html", function(response, status, xhr) {
//             if (status === "error") {
//                 console.log("Error loading the page: " + xhr.status + " " + xhr.statusText);
//             }
//         });
//     });

//     $("#home-link").on("click", function() {
//         if ($("main").is(':empty') || !$("#content").is(':empty')) {
//             // If not already loaded, load the content from the existing page
//             $("main").html($("#content").html()); // Load the existing content
//         } else {
//             console.log("Already on the home content.");
//         }
//     });

//     // Load login.html when the login-link is clicked
//     $("#login-link").on("click", function() {
//         $("main").load("login.html", function(response, status, xhr) {
//             if (status === "error") {
//                 console.log("Error loading the page: " + xhr.status + " " + xhr.statusText);
//             }
//         });
//     });

//     $("#signup-link").on("click", function() {
//         $("main").load("signup.html", function(response, status, xhr) {
//             if (status === "error") {
//                 console.log("Error loading the page: " + xhr.status + " " + xhr.statusText);
//             }
//         });
//     });
// });
