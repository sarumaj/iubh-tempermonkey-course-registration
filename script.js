// ==UserScript==
// @name        Add Button and Dropdowns for POST Request with GM_xmlhttpRequest
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Add dropdowns and a button to send a POST request to a specified URL bypassing CORS.
// @author      You
// @match       https://mycampus.iubh.de/local/iubh_ac5sso/ac5kursbuchung.php
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Your courses may vary
    const courses = [
        { name: "Advanced Mathematics (DLMDSAM01)", lectureSeriesId: '10053254', curriculumEntryId: '10559081' },
        { name: "Advanced Statistics (DLMDSAS01)", lectureSeriesId: '10053256', curriculumEntryId: '10559083' },
        { name: "Algorithmics (DLMCSA01)", lectureSeriesId: '10052515', curriculumEntryId: '10559090' },
        { name: "Artificial Intelligence (DLMAIAI01)", lectureSeriesId: '10048787', curriculumEntryId: '10559096' },
        { name: "Big Data Technologies (DLMDSBDT01)", lectureSeriesId: '10059760', curriculumEntryId: '10559098' },
        { name: "Blockchain (DLMCSEBCQC01)", lectureSeriesId: '10055157', curriculumEntryId: '10559121' },
        { name: "Business Intelligence I (DLMDSEBA01)", lectureSeriesId: '10059761', curriculumEntryId: '10559125' },
        { name: "Cryptology (DLMCSEAITSC02)", lectureSeriesId: '10055156', curriculumEntryId: '10559119' },
        { name: "Cyber Security and Data Protection (DLMCSITSDP01)", lectureSeriesId: '10052516', curriculumEntryId: '10559092' },
        { name: "Data Engineering (DLMDSEDE01)", lectureSeriesId: '10059758', curriculumEntryId: '10559128' },
        { name: "Data Science (DLMBDSA01)", lectureSeriesId: '10181947', curriculumEntryId: '10559085' },
        { name: "Deep Learning (DLMDSDL01)", lectureSeriesId: '10053249', curriculumEntryId: '10559134' },
        { name: "IT Governance and Compliance (DLMBITGSM02)", lectureSeriesId: '10044231', curriculumEntryId: '10559116' },
        { name: "IT Project Management (DLMBITPAM01)", lectureSeriesId: '10044228', curriculumEntryId: '10559131' },
        { name: "IT Service Management (DLMBITGSM01)", lectureSeriesId: '10044230', curriculumEntryId: '10559115' },
        { name: "Machine Learning (DLMDSML01)", lectureSeriesId: '10053248', curriculumEntryId: '10559135' },
        { name: "Networks and Distributed Systems (DLMCSNDS01)", lectureSeriesId: '10083052', curriculumEntryId: '10559103' },
        { name: "Programming with Python (DLMDSPWP01)", lectureSeriesId: '10061051', curriculumEntryId: '10559077' },
        { name: "Project: Business Intelligence (DLMDSEBA02)", lectureSeriesId: '10059762', curriculumEntryId: '10559126' },
        { name: "Project: Computer Science Project (DLMCSPCSP01)", lectureSeriesId: '10072848', curriculumEntryId: '10559100' },
        { name: "Project: Data Engineering (DLMDSEDE02)", lectureSeriesId: '10059759', curriculumEntryId: '10559129' },
        { name: "Project: Data Science Use Case (DLMDSPDSUC01)", lectureSeriesId: '10053260', curriculumEntryId: '10559138' },
        { name: "Project: Human Computer Interaction (DLMAIEUIUX02)", lectureSeriesId: '10059755', curriculumEntryId: '10559113' },
        { name: "Project: Software Engineering (DLMCSPSE01)", lectureSeriesId: '10060795', curriculumEntryId: '10559087' },
        { name: "Project: Technical Project Planning (DLMDSETPL01)", lectureSeriesId: '10055167', curriculumEntryId: '10559132' },
        { name: "Quantum Computing (DLMCSEBCQC02)", lectureSeriesId: '10067881', curriculumEntryId: '10559122' },
        { name: "Seminar: Advanced Cyber Security (DLMCSEAITSC01)", lectureSeriesId: '10052563', curriculumEntryId: '10559118' },
        { name: "Seminar: Computer Science and Society (DLMCSSCSAS01)", lectureSeriesId: '10052513', curriculumEntryId: '10559094' },
        { name: "Seminar: Current Topics in Computer Science (DLMCSSCTCS01)", lectureSeriesId: '10083051', curriculumEntryId: '10559105' },
        { name: "Software Engineering: Software Processes (DLMCSSESP01)", lectureSeriesId: '10060796', curriculumEntryId: '10559079' },
        { name: "Use Case and Evaluation (DLMDSUCE01)", lectureSeriesId: '10050661', curriculumEntryId: '10559137' },
        { name: "User Interface and Experience (DLMAIEUIUX01)", lectureSeriesId: '10068387', curriculumEntryId: '10559112' }
    ];

    // Actions should remain the same
    const actions = ['BookCourse', 'CancelBooking'];

    // Create container div
    const containerDiv = document.createElement('div');
    containerDiv.style.position = 'fixed';
    containerDiv.style.bottom = '20px';
    containerDiv.style.right = '20px';
    containerDiv.style.zIndex = '1000';
    containerDiv.style.backgroundColor = '#f9f9f9';
    containerDiv.style.border = '1px solid #ccc';
    containerDiv.style.padding = '10px';
    containerDiv.style.borderRadius = '5px';
    containerDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,.2)';

    // Create the dropdown for courses
    const courseSelect = document.createElement('select');
    courseSelect.id = 'course-select';
    courses.forEach(course => {
        let option = new Option(course.name, JSON.stringify({ lectureSeriesId: course.lectureSeriesId, curriculumEntryId: course.curriculumEntryId }));
        courseSelect.appendChild(option);
    });

    // Create the dropdown for actions
    const actionSelect = document.createElement('select');
    actionSelect.id = 'action-select';
    actions.forEach(action => {
        let option = new Option(action, action);
        actionSelect.appendChild(option);
    });

    // Create a new button element
    const button = document.createElement('button');
    button.textContent = 'Submit';

    // Append the dropdowns and button to the container div
    containerDiv.appendChild(courseSelect);
    containerDiv.appendChild(actionSelect);
    containerDiv.appendChild(button);

    // Add the container div to the body of the webpage
    document.body.appendChild(containerDiv);

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        const selectedCourse = JSON.parse(courseSelect.value);
        const action = actionSelect.value;
        const enrolmentPeriodId = '12'; // Assuming this is static, but it may vary for each student
        const bookingId = '10761449'; // Assuming this is static, but it may vary for each student or study course (this works for M.Sc. CS)

        // Specify the URL
        const url = `https://care-fs.iubh.de/ajax/4713/CourseInscriptionCurricular/DefaultController/${action}` +
              `?enrolmentPeriodId=${enrolmentPeriodId}` +
              `&lectureSeriesId=${selectedCourse.lectureSeriesId}` +
              `&assignedSubjectIds=` +
              `&curriculumEntryId=${selectedCourse.curriculumEntryId}` +
              `&bookingId=${bookingId}`;

        // Use GM_xmlhttpRequest to send the POST request
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({}), // Assuming POST data is empty; adjust as necessary
            onload: function(response) {
                // The response of the request
                if (response.status >= 200 && response.status < 300) {
                    console.log('Success:', response.responseText);
                    alert("Success!");
                } else {
                    console.log('Server responded with a status:', response.status);
                    alert('Failure!');
                }
            },
            onerror: function(response) {
                console.log('Request failed:', response);
                alert('Error!');
            }
        });
    });
})();
