
// initialize the OAuth app.
OAuth.initialize('CMe8Uc8Zy9TY3s1MX9R1_PC4TsA');

//Get the options/configuration for the request and include the token from sessionStorage.
function createOptions(method, bodyMessage) {
    bodyTemp = method == "POST" ? body : null;

    return ({
        method: method,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,

        },
        bodyTemp: bodyMessage,

    });
    
}


function LoginFunction(event) {
    event.preventDefault();
    OAuth.popup('google').done(function (result) {
        result.me().done(function (data) {
            const email = data.raw.email;
            const requestData = {
                Email: email
            };
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            };
            //check if email is in our database.
            console.log('sending request to check email: ' + email);
            fetch("http://localhost:5263/api/Auth/Login", options)
                .then(response => response.json())
                .then(data => checkResponse(data)).catch(err => console.log(err));
        });
    }).fail(function (err) {
        //todo when the OAuth flow failed
    });





}

function checkResponse(responseData) {
    if (responseData.isSuccess == false) {
        alert(responseData.message);
    }
    else {

        sessionStorage.setItem("userId", responseData.Id);
        sessionStorage.setItem("token", responseData.message);
        sessionStorage.setItem("role", responseData.role);
        console.log(responseData);
        if(responseData.role === "University Admin"){
            sessionStorage.setItem("universityId", responseData.universityID);
          console.log(sessionStorage.getItem("universityId"));
          location.href = "/pages/UniversityDashboard/dashboard.html";
      }
      
      
        location.href = "/pages/AdminDashboard/dashboard.html";
    }
}



document.addEventListener("DOMContentLoaded", () => {
    googleButton = document.getElementById("google-login");

    googleButton.addEventListener("click", event => LoginFunction(event))



});
