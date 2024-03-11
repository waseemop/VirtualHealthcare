const mainFunction=async ()=>{

    if(!localStorage.getItem('authtoken')){
        location.href="../Home.html";
        alert("Please login to continue");
        return;
    }

const fetchData= async()=>{

    const fetchUserInfo = async () => {
        const url = "http://localhost:4000/api/auth/getuser";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authtoken":localStorage.getItem('authtoken')
            },
        });
        const result = await response.json();
        console.log(result);
        return result;
    }


    const updateUserNameTags= async()=>{
        const user=await fetchUserInfo();
        const username=user.name;
        console.log(username);
        const usernameUpdatableTags = document.getElementsByClassName("username");
        Array.from(usernameUpdatableTags).forEach((element) => {
            element.innerText = username;
        })
    }
    await updateUserNameTags()
    
    
    const fetchAllDoctors = async () => {
        const url = "http://localhost:4000/api/getalldoctors";
        const response = await fetch(url);
        const result = await response.json();
        return result;
    }


    const updateDoctorNameTags= async()=>{
       const doctors= await fetchAllDoctors();
       console.log(doctors);
       const cards=document.getElementById("cards");
       console.log(cards);
        if(doctors){
            Array.from(doctors).forEach((doctor)=>{
                const card=document.createElement("div");
                card.classList.add("card","border-1","border-dark","mb-3","me-3");
                card.style.width="15rem";
                const image=document.createElement("img");
                image.src="./images/Doctor logo.png";
                image.classList.add("card-img-top");
                image.alt="...";
                const cardbody=document.createElement("div");
                cardbody.classList.add("card-body");
                cardbody.setAttribute('id',doctor._id)
                const cardtitle=document.createElement("h5");
                cardtitle.classList.add("card-title");
                cardtitle.innerText="Dr. "+doctor.name;
                const cardtext=document.createElement("p");
                cardtext.classList.add("card-text");
                cardtext.innerText="~ "+doctor.specialist;
                const cardtext1=document.createElement("p");
                cardtext1.classList.add("card-text");
                cardtext1.innerText=doctor.location;
                const cardtext2=document.createElement("p");
                cardtext2.classList.add("card-text");
                cardtext2.innerText=doctor.hospital;
                const button=document.createElement("button");
                button.classList.add("btn","btn-success","RequestAppointmentButton");
                button.innerText="Request An Appointment";
                cardbody.appendChild(cardtitle);
                cardbody.appendChild(cardtext);
                cardbody.appendChild(cardtext2);
                cardbody.appendChild(cardtext1);
                cardbody.appendChild(button);
                card.appendChild(image);
                card.appendChild(cardbody);
                cards.appendChild(card);
            })
        }
    }
    await updateDoctorNameTags()

    
}
await fetchData();



const fetchAppointments=async()=>{
    const url = "http://localhost:4000/api/appointment/fetchallappointments";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authtoken":localStorage.getItem('authtoken'),
            "ispatient":true
        },
    });
    const result = await response.json();
    return result;
}


const showAppointments= async()=>{
    const AppointmentContainer=document.getElementById("AppointmentContainer");
    const appointments=await fetchAppointments();
    AppointmentContainer.innerHTML="";
    console.log("appointments",appointments);
    if(appointments.length===0){
        const noitems=document.createElement("h5");
        noitems.classList.add('text-dark')
        noitems.innerText="No appointments found...";
        AppointmentContainer.appendChild(noitems)
    }
    else{
        appointments.forEach((appointment)=>{

            const col=document.createElement("div");
            col.classList.add("col");

            const card=document.createElement("div");
            card.classList.add("card");

            const cardbody=document.createElement("div");
            cardbody.classList.add("cardbody","d-block" ,"d-md-flex" ,"align-items-center" ,"justify-content-between", "p-4");
            const appointmenttime=document.createElement("h5");
            appointmenttime.classList.add("m-md-0");
            appointmenttime.innerHTML=appointment.date+"&nbsp;&nbsp;&nbsp;&nbsp;"+appointment.time;
            const doctor_specialist=document.createElement("p");
            doctor_specialist.classList.add("m-md-0")
            doctor_specialist.innerText="Dr."+appointment.doctorname;
            const status=document.createElement("p");
            status.classList.add("m-md-0")
            status.innerText=appointment.status;
            appointment.status==='pending'?status.classList.add("text-warning"):appointment.status==='rejected'?status.classList.add("text-danger"):appointment.status==='accepted'?status.classList.add("text-success"):status.classList.add("text-info")
            cardbody.appendChild(appointmenttime)
            cardbody.appendChild(doctor_specialist)
            cardbody.appendChild(status)
            if(appointment.status==='pending'||appointment.status==='accepted')
            {
                const deletebutton=document.createElement('button');
            deletebutton.classList.add("btn","btn-outline-danger","deletebutton");
            deletebutton.setAttribute('id',appointment._id);
            deletebutton.innerText="Cancel";
            deletebutton.addEventListener('click',async()=>{
                const confirmation=confirm("Are you sure you want to cancel the appointment?");
                if(!confirmation){
                    return ;
                }
                const url="http://localhost:4000/api/appointment/deleteappointment/"+deletebutton.getAttribute('id');
                    const response = await fetch(url, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "authtoken":localStorage.getItem("authtoken"),
                            "ispatient":true
                        },
                    });
                    const result= await response.json();
                    console.log(result);
                    if(result.success){
                      alert("Cancelled the appointment.");
                      deletebutton.parentNode.parentNode.parentNode.style.display="none";
                    }
                    else{
                        alert(result.error)
                    }
            })
                cardbody.appendChild(deletebutton)
            }
            card.appendChild(cardbody);
            col.appendChild(card);
            AppointmentContainer.appendChild(col);

        })
    }
}
await showAppointments();





const AppointmentButtons=document.getElementsByClassName("RequestAppointmentButton");
console.log(Array.prototype.slice.call( AppointmentButtons ));
Array.prototype.slice.call( AppointmentButtons ).forEach((AppointmentButton)=>{
    // console.log(AppointmentButton);
    AppointmentButton.addEventListener('click',(e)=>{
        const button=e.target;
        const docid=button.parentElement.getAttribute('id');
        const hospital=button.parentElement.children[2].innerText;
        const location=button.parentElement.children[3].innerText;
        const doctoridtag=document.getElementById("doctorid");
        const locationtag=document.getElementById("location");
        const hospitalnametag=document.getElementById("hospitalname");
        console.log(hospitalnametag);
        doctoridtag.innerText=docid;
        hospitalnametag.value=hospital;
        locationtag.value=location;
        console.log(doctoridtag.innerText);
        const doctorname=button.parentElement.children[0].innerText;
        const specialist=button.parentElement.children[1].innerText;
        const modalbutton=document.getElementById("launchModal");
        console.log(modalbutton);
        const consultingdoctor=document.getElementById("consultingdoctor");
        consultingdoctor.value=doctorname+" ("+specialist.slice(2)+")";
        consultingdoctor.setAttribute('readonly',true);
        modalbutton.click();
    })
})


const appointmentform=document.getElementById("appointmentform");
appointmentform.addEventListener('submit',async (e)=>{
    e.preventDefault();
    console.log(e.target);
    const patientname=e.target[0].value;
    const email=e.target[1].value;
    const mobile=e.target[2].value;
    let doctorname=e.target[3].value;
    doctorname=doctorname.slice(3,doctorname.indexOf("(")).trim();
    const doctorid=document.getElementById("doctorid").innerText;
    const location=e.target[4].value;
    const hospital=e.target[5].value;
    const date=e.target[6].value;
    const time=e.target[7].value;

    console.log(patientname,email,mobile,doctorname,doctorid,location,hospital,date,time);
    const url="http://localhost:4000/api/appointment/addappointment";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken":localStorage.getItem("authtoken")
                },
                body: JSON.stringify({doctorid:doctorid,doctorname:doctorname,username:patientname,hospital:hospital,location:location,date:date,time:time,status:"pending"}), 
            });
            const result= await response.json();
            console.log(result);
            if(result.success){
                const closeModal=document.getElementById("closeModal");
                closeModal.click();
                alert("Appointment Requested Successfully")
                await showAppointments();
            }
            else{
                alert(result.error)
            }
})



const displayHome=document.getElementById("displayHome");
const home=document.getElementById("home");
const displayAppointments=document.getElementById("displayAppointments");

home.addEventListener('click',()=>{
    const Home=document.getElementById("Home");
    const Appointments=document.getElementById("Appointments")
    Home.setAttribute('style', 'display:flex !important');
    Appointments.setAttribute('style', 'display:none !important');
    displayHome.setAttribute('style', 'color:blueviolet !important');
    displayAppointments.setAttribute('style', 'color:white !important');
})
displayHome.addEventListener('click',()=>{
    const Home=document.getElementById("Home");
    const Appointments=document.getElementById("Appointments")
    Home.setAttribute('style', 'display:flex !important');
    Appointments.setAttribute('style', 'display:none !important');
    displayHome.setAttribute('style', 'color:blueviolet !important');
    displayAppointments.setAttribute('style', 'color:white !important');
})

displayAppointments.addEventListener('click',async()=>{
    const Home=document.getElementById("Home");
    const Appointments=document.getElementById("Appointments")
    displayHome.setAttribute('style', 'color:white !important');
    displayAppointments.setAttribute('style', 'color:blueviolet !important');
    Home.setAttribute('style', 'display:none !important');
    Appointments.setAttribute('style', 'display:block !important');
})

const logout=document.getElementById("logout");
logout.addEventListener('click',()=>{
    location.href="../Home.html";
    localStorage.removeItem('authtoken')
    // alert("Logged out successfully");
    return;
})


}
mainFunction()
