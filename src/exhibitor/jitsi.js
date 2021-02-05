var s = document.getElementsByTagName('script')[0];

var jitsi = document.createElement('script');
jitsi.type = 'text/javascript'; 
jitsi.async = true; 
jitsi.defer = true; 
jitsi.src = 'https://meet.jit.si/external_api.js';
// jitsi.src = 'https://localhost:8443/libs/lib-jitsi-meet.min.js'; 
s.parentNode.insertBefore(jitsi, s);


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
    inActiveParticipants.forEach(participant => {$('#inactiveParticipantsList').append(`<li class="list-group-item">${participant.displayName}(${participant.email})</li>`)});
}

function init(roomType, name){
    const domain = 'meet.jit.si';
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
        const {senderInfo,eventData} = event.data;
        participants.filter(participant =>participant.participantId === senderInfo.id)[0].email = eventData.text;
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
}

function start(roomType) {
    init(roomType,getExhibitorName());
    $('#startBtn').hide();
}

function getExhibitorName(){
    const result = getUrlVars();
    if(result.id && result.id == 3){
        return 'Access IS';
    }
    if(result.id && result.id == 2){
        return 'Data Capture Systems (DCS)';
    }
    return 'BOMBELLI Airport Equipment';
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


