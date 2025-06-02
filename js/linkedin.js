let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let date = document.getElementById("date");
let length = document.getElementById("length");
let course = document.getElementById("course");
let form = document.getElementById("form");
let container = document.querySelector(".container");
let generate = document.getElementById("Generate");

generate.addEventListener("click", (e) => {
    e.preventDefault();

    let first_name = fname.value;
    let last_name = lname.value;
    let Date = date.value;
    let c_length = length.value;
    let course_name = course.value;

    // Hide the form
    form.style.display = "none";
    container.style.backgroundColor = "white";

    // Generate random digits for certificate ID
    let rand = Math.round(1 + Math.random() * 8);
    let rand2 = Math.round(1 + Math.random() * 8);

    // Display the certificate
    let certificate = document.getElementById("certificate");
    certificate.style.display = "block";
    certificate.innerHTML = `
        <div class="outer">
            <div class="light-br">
                <div class="dark-br">
                    <div class="main-content">
                        <div class="left-side">
                            <img src="img/LinkedIn left-2.png" alt="">
                        </div>
                        <div class="right-content">
                            <div class="logo">
                                <img id="logo" src="img/Learning.png" alt="">
                            </div>
                            <div class="congrats">
                                <h2>Certificate of Completion</h2>
                                <h3>Congratulations, ${first_name} ${last_name}</h3>
                            </div>
                            <div class="course-name">
                                <h1>${course_name}</h1>
                                <div class="completion">
                                    <h3>Course completed on ${Date}</h3>
                                    <h3 id="clength">•&nbsp;&nbsp;${c_length}</h3>
                                </div>
                            </div>
                            <div class="para">
                                <h2>By continuing to learn, you have expanded your perspective, sharpened your skills, and made yourself even more in demand.</h2>
                            </div>
                            <div class="authority">
                                <div class="part-1">
                                    <img id="sign" src="img/Sign2.JPG" alt="">
                                    <h3>VP, Learning Content at EduVerse</h3>
                                </div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="vl"></div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="part-2">
                                    <h3>EduVerse</h3>
                                    <h3>Tilagarh, Alurtol Road</h3>
                                    <h3>Sylhet 3100</h3>
                                </div>
                            </div>
                            <div class="certificate-id">Certificate Id: AU${rand}IZ${rand2}a${rand}rPeUmO_IE${rand}R${rand}0L${rand}ac${rand}sN</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Show the download button
    document.getElementById("download").style.display = "block";
});

// Download PDF functionality
let download = document.getElementById("download");
download.addEventListener("click", () => {
    var opt = {
        margin: 1,
        filename: "EduVerse-certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "px", format: "a2", orientation: "landscape" },
    };
    html2pdf().set(opt).from(document.getElementById("certificate")).save();
});