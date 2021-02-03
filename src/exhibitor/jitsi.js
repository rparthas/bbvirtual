var s = document.getElementsByTagName('script')[0];

var jitsi = document.createElement('script');
jitsi.type = 'text/javascript'; 
jitsi.async = true; 
jitsi.defer = true; 
jitsi.src = 'https://meet.jit.si/external_api.js';
// jitsi.src = 'https://localhost:8443/libs/lib-jitsi-meet.min.js'; 
s.parentNode.insertBefore(jitsi, s);


var scanner = document.createElement('script');
scanner.type = 'text/javascript'; 
scanner.async = true; 
scanner.defer = true; 
scanner.src = 'https://rawgit.com/schmich/instascan-builds/master/instascan.min.js'; 
s.parentNode.insertBefore(scanner, s);


var api;
var participants = [];

function displayParticipants(){
    const activeParticipants = participants.filter(participant =>participant.status == 'Active');
    const inActiveParticipants = participants.filter(participant =>participant.status == 'InActive');
    document.getElementById('activeCnt').innerHTML = activeParticipants.length;
    document.getElementById('pastCnt').innerHTML = inActiveParticipants.length;
    $('#activeParticipants').html('<ul id="activeParticipantsList" class="list-group"></ul>');
    activeParticipants.forEach(participant => {$('#activeParticipantsList').append(`<li class="list-group-item">${participant.displayName}</li>`)});
    $('#inactiveParticipants').html('<ul id="inactiveParticipantsList" class="list-group"></ul>');
    inActiveParticipants.forEach(participant => {$('#inactiveParticipantsList').append(`<li class="list-group-item">${participant.displayName}</li>`)});
}

function init(roomType){
    const domain = 'meet.jit.si';
    const name = 'BOMBELLI Airport Equipment';
    const options = {
        roomName: roomType == "Lounge" ? `Networking Lounge for ${name}`:`Webinar for ${name}`,
        width: 500,
        height: 500,
        parentNode: document.querySelector('#video'),
        userInfo: {
            displayName: name
        },
        configOverwrite : {
            prejoinPageEnabled: false
        }
    };
    api = new JitsiMeetExternalAPI(domain, options);
    api.addEventListener('endpointTextMessageReceived',(event)=>{
        document.getElementById('scannedText').innerHTML = "<div> Scanned this: "+event.data.eventData.text+"</div>";
    });
    api.addEventListener('participantJoined',(event)=>{
        var participant = api.getParticipantsInfo().filter(participant =>participant.participantId === event.id)[0];
        participant.status = 'Active';
        participants.push(participant);
        displayParticipants();
    });
    api.addEventListener('participantLeft',(event)=>{
        participants.filter(participant =>participant.participantId == event.id)[0].status ='InActive';  
        displayParticipants();
    });
    api.addEventListener('videoConferenceLeft',(_)=>{
        api.dispose();
        $('#startBtn').show();
    });
    api.addEventListener('emailChange',(event)=>{
        console.log("### Email change###",event);
    });
}


function scan(){
    let scanner = new Instascan.Scanner({
        video: document.getElementById('preview'),
        scanPeriod: 5
    });

    scanner.addListener('scan', function (content) {
        console.log(content);
        api.executeCommand("sendEndpointTextMessage", "", content);
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
}

function start(roomType) {
    init(roomType);
    scan();
    $('#startBtn').hide();
}


