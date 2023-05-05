// $.getJSON("https://api.ipify.org?format=json", function(data) {

//         // Setting text of element P with id gfg
//         $("#ipAddress").html(data.ip);
//     })
window.onload = function() {  
    getDataFromAPI();
  };
var ip;
var data;
var pincode;
var postoffices;
async function getDataFromAPI() {
    // console.log("Fetching Data...");

    try {
        const response = await fetch("https://api.ipify.org?format=json");
        arr = await response.json();

        // alert("Added to Session Storage");
        if (arr) {
            // console.log("data", arr);
            ip = arr.ip;
            // console.log(ip)
            document.getElementById("ipAddress").innerText = ip;
        }
    } catch (e) {
        console.log("Error--", e);
    }
}


var btn = document.querySelector(".btn");
btn.addEventListener("click", async (e) => {
    e.preventDefault();
    if(ip){
        btn.style.display = 'none';
    
    try {
        const response = await fetch(
            `https://ipinfo.io/${ip}/geo?token=6b281122e10316`
        );
        data = await response.json();

        // alert("Added to Session Storage");
        if (data) {
            console.log("data", data);
            // console.log(typeof(data.loc))
            var location = data.loc.split(",");
            pincode = data.postal
            // console.log(location);
            document.querySelector(".location").innerHTML = `<p><strong>Lat:</strong>${location[0]}</p>
            <p><strong>Long:</strong>${location[1]}</p>`;

            document.querySelector(".city").innerHTML = `<p><strong>City:</strong>${data.city}</p>
                        <p><strong>Region:</strong>${data.region}</p>`;

            document.querySelector(".org").innerHTML = `<p><strong>Organisation:</strong>${data.org}</p>
            <p><strong>Hostname:</strong>${data.hostname}</p>`; 

            document.querySelector(".map").innerHTML = `<iframe src="https://maps.google.com/maps?q=${location[0]}, ${location[1]}&z=15&output=embed" width="100%" height="350" frameborder="0" style="border:0"></iframe>`;           
            
            document.querySelector(".part2").innerHTML = `<p><strong>Time Zone:</strong>${data.timezone}</p>
            <p><strong>Date and Time:</strong>${new Date().toLocaleString("en-IN", { timeZone: data.timezone })}</p>
            <p><strong>Pincode:</strong>${data.postal}</p>`; 
            getPostalFromAPI();
        }
    } catch (e) {
        console.log("Error--", e);
    }
    }
    
});


async function getPostalFromAPI() {
    // console.log("Fetching Data...");

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        postalArr = await response.json();
        document.getElementById("search").style.display = 'block';

        // alert("Added to Session Storage");
        if (postalArr) {
            console.log("data", postalArr);
            postoffices = postalArr[0].PostOffice;
            console.log(postoffices)
            document.querySelector(".part2").innerHTML += `<p><strong>Message:</strong>${postalArr[0].Message}</p>`
            showData(postoffices)
        }
    } catch (e) {
        console.log("Error--", e);
    }
}


document.getElementById("search").addEventListener("input", () => {
    var newArr = postoffices.filter((item) =>
      (item.Name
        .toLowerCase()
        .includes(document.getElementById("search").value.trim().toLowerCase()) || item.BranchType
        .toLowerCase()
        .includes(document.getElementById("search").value.trim().toLowerCase()) )
    );
    showData(newArr);
  });

function showData(myArr) {
    document.querySelector(".part3").innerHTML = "";
    let innerhtml = "";
    myArr.forEach((item) => {
      innerhtml += `
      <div class="item">
                <p><strong>Name:</strong>${item.Name}</p>
                <p><strong>Branch Type:</strong>${item.BranchType}</p>
                <p><strong>Delivery Status:</strong>${item.DeliveryStatus}</p>
                <p><strong>District:</strong>${item.District}</p>
                <p><strong>Division:</strong>${item.Division}</p>
            </div>
      `;
    });
    document.querySelector(".part3").innerHTML = innerhtml;
  }