const mainFunction = async () => {

    if (!localStorage.getItem('authtoken')) {
        location.href = "../Home.html";
        return;
    }

    const fetchData = async () => {

        const fetchUserInfo = async () => {
            const url = "http://localhost:4000/api/auth/getdoctor";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": localStorage.getItem('authtoken')
                },
            });
            const result = await response.json();
            console.log(result);
            return result;
        }


        const updateDoctorNameTag = async () => {
            const doctor = await fetchUserInfo();
            const doctorname = doctor.name;
            console.log(doctorname);
            const doctornameUpdatableTags = document.getElementsByClassName("doctorname");
            Array.from(doctornameUpdatableTags).forEach((element) => {
                element.innerText = doctorname;
            })
        }
        await updateDoctorNameTag()

    }
    await fetchData();



    const fetchAppointments = async () => {
        const url = "http://localhost:4000/api/appointment/fetchallappointments";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem('authtoken'),
                "ispatient": false
            },
        });
        const result = await response.json();
        return result;
    }


    const showAppointments = async () => {
        const AppointmentContainer = document.getElementById("AppointmentContainer");
        const PreviousAppointmentsContainer = document.getElementById("previousAppointmentsContainer");
        const appointments = await fetchAppointments();
        AppointmentContainer.innerHTML = "";
        console.log("appointments", appointments);
        let completedAppointmentsExist=false;
        let notCompletedAppointmentsExist=false;
        if (appointments.length === 0) {
            const noitems = document.createElement("h5");
            noitems.classList.add('text-dark')
            noitems.innerText = "No appointments found...";
            AppointmentContainer.appendChild(noitems)
        }
        else {
            appointments.forEach((appointment) => {
                if (appointment.status === 'completed') {

                    const col = document.createElement("div");
                    col.classList.add("col");

                    const card = document.createElement("div");
                    card.classList.add("card");

                    const cardbody = document.createElement("div");
                    cardbody.classList.add("cardbody", "d-block", "d-md-flex", "align-items-center", "justify-content-between", "p-4");

                    const appointmenttime = document.createElement("h5");
                    appointmenttime.classList.add("m-md-0");
                    appointmenttime.innerText = appointment.date + " " + appointment.time;

                    const doctor_specialist = document.createElement("p");
                    doctor_specialist.classList.add("m-md-0")
                    doctor_specialist.innerText = appointment.username;

                    const status = document.createElement("p");
                    status.classList.add("m-md-0")
                    status.innerText = appointment.status;
                    status.classList.add("text-warning");

                    cardbody.appendChild(appointmenttime)
                    cardbody.appendChild(doctor_specialist)
                    cardbody.appendChild(status)
                    card.appendChild(cardbody);
                    col.appendChild(card);
                    PreviousAppointmentsContainer.appendChild(col);
                    completedAppointmentsExist=true;
                }

                else {

                    const col = document.createElement("div");
                    col.classList.add("col");

                    const card = document.createElement("div");
                    card.classList.add("card");

                    const cardbody = document.createElement("div");
                    cardbody.classList.add("cardbody", "d-block", "d-md-flex", "align-items-center", "justify-content-between", "p-4");

                    const appointmenttime = document.createElement("h5");
                    appointmenttime.classList.add("m-md-0");
                    appointmenttime.innerHTML=appointment.date+"&nbsp;&nbsp;&nbsp;&nbsp;"+appointment.time;

                    const doctor_specialist = document.createElement("p");
                    doctor_specialist.classList.add("m-md-0")
                    doctor_specialist.innerText = appointment.username;

                    const status = document.createElement("p");
                    status.classList.add("m-md-0")
                    status.innerText = appointment.status;
                    appointment.status === 'pending' ? status.classList.add("text-warning") : appointment.status === 'accepted' ?status.classList.add("text-success"):appointment.status === 'rejected' ? status.classList.add("text-danger") :status.classList.add("text-info")

                    cardbody.appendChild(appointmenttime)
                    cardbody.appendChild(doctor_specialist)
                    cardbody.appendChild(status)

                    if(appointment.status==='pending'||appointment.status==='accepted'){
                        const deletebutton = document.createElement('button');
                    deletebutton.classList.add("btn", "btn-outline-danger", "deletebutton");
                    deletebutton.setAttribute('id', appointment._id);
                    deletebutton.innerText = "Reject";
                    deletebutton.addEventListener('click', async () => {
                        const url = "http://localhost:4000/api/appointment/updateappointment/" + deletebutton.getAttribute('id');
                            const response = await fetch(url, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "authtoken": localStorage.getItem("authtoken"),
                                    "ispatient": false
                                },
                                body: JSON.stringify({ status: "rejected" }),
                            });
                            const result = await response.json();
                            console.log(result);
                            if (result.success) {
                                alert("Appointment Rejected.");
                               location.reload()
                            }
                            else {
                                alert(result.error)
                            }
                    })
                    cardbody.appendChild(deletebutton)
                   
                    }

                    if (appointment.status === 'pending') {
                        const acceptbutton = document.createElement('button');
                        acceptbutton.classList.add("btn", "btn-outline-success", "deletebutton");
                        acceptbutton.setAttribute('id', appointment._id);
                        acceptbutton.innerText = "Accept";
                        acceptbutton.addEventListener('click', async () => {
                            const url = "http://localhost:4000/api/appointment/updateappointment/" + acceptbutton.getAttribute('id');
                            const response = await fetch(url, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "authtoken": localStorage.getItem("authtoken"),
                                    "ispatient": false
                                },
                                body: JSON.stringify({ status: "accepted" }),
                            });
                            const result = await response.json();
                            console.log(result);
                            if (result.success) {
                                alert("Accepted the appointment.");
                                // acceptbutton.style.display = "none";
                                // acceptbutton.parentElement.children[2].innerText = "accepted";
                                // acceptbutton.parentElement.children[2].classList.remove("text-danger");
                                // acceptbutton.parentElement.children[2].classList.add("text-success");
                                location.reload()
                                
                            }
                            else {
                                alert(result.error)
                            }
                        })
                        cardbody.appendChild(acceptbutton)
                    }
                    else if (appointment.status === 'accepted') {
                        const completebutton = document.createElement('button');
                        completebutton.classList.add("btn", "btn-outline-info", "completebutton");
                        completebutton.setAttribute('id', appointment._id);
                        completebutton.innerText = "Mark as complete";
                        completebutton.addEventListener('click', async () => {
                            const url = "http://localhost:4000/api/appointment/updateappointment/" + completebutton.getAttribute('id');
                            const response = await fetch(url, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "authtoken": localStorage.getItem("authtoken"),
                                    "ispatient": false
                                },
                                body: JSON.stringify({ status: "completed" }),
                            });
                            const result = await response.json();
                            console.log(result);
                            if (result.success) {
                                alert("Appointment Completed.");
                                // completebutton.style.display = "none";
                                // completebutton.parentElement.children[2].innerText = "completed";
                                // completebutton.parentElement.children[2].classList.remove("text-danger");
                                // completebutton.parentElement.children[2].classList.add("text-warning");
                               location.reload()
                            }
                            else {
                                alert(result.error)
                            }
                        })
                        cardbody.appendChild(completebutton)
                    }
                    
                    card.appendChild(cardbody);
                    col.appendChild(card);
                    AppointmentContainer.appendChild(col);
                    notCompletedAppointmentsExist=true;
                }
            })
        }
        if(!completedAppointmentsExist){
            const noitems = document.createElement("h5");
            noitems.classList.add('text-dark')
            noitems.innerText = "No appointments found...";
            PreviousAppointmentsContainer.appendChild(noitems)
        }
        if(!notCompletedAppointmentsExist){
            const noitems = document.createElement("h5");
            noitems.classList.add('text-dark')
            noitems.innerText = "No appointments found...";
            AppointmentContainer.appendChild(noitems)
        }

    }
    await showAppointments();

    const displayHome = document.getElementById("displayHome");
    const home = document.getElementById("home");
    const displayPrevAppointments = document.getElementById("displayPrevAppointments");


    home.addEventListener('click', () => {
        const Home = document.getElementById("Home");
        const previousappointments = document.getElementById("previousappointments")
        Home.setAttribute('style', 'display:block !important');
        previousappointments.setAttribute('style', 'display:none !important');
        displayHome.setAttribute('style', 'color:blueviolet !important');
        displayPrevAppointments.setAttribute('style', 'color:white !important');
    })
    displayHome.addEventListener('click', () => {
        const Home = document.getElementById("Home");
        const previousappointments = document.getElementById("previousappointments")
        Home.setAttribute('style', 'display:block !important');
        previousappointments.setAttribute('style', 'display:none !important');
        displayHome.setAttribute('style', 'color:blueviolet !important');
        displayPrevAppointments.setAttribute('style', 'color:white !important');
    })

    displayPrevAppointments.addEventListener('click', async () => {
        const Home = document.getElementById("Home");
        const previousappointments = document.getElementById("previousappointments")
        displayHome.setAttribute('style', 'color:white !important');
        displayPrevAppointments.setAttribute('style', 'color:blueviolet !important');
        Home.setAttribute('style', 'display:none !important');
        previousappointments.setAttribute('style', 'display:block !important');
    })



    const logout = document.getElementById("logout");
    logout.addEventListener('click', () => {
        location.href = "../Home.html";
        localStorage.removeItem('authtoken')
        // alert("Logged out successfully");
        return;
    })

    setTimeout(() => {
        const spinner=document.getElementsByClassName("overlay")[0];
        spinner.style.display="none"
    }, 1500);

}
mainFunction()
