var s = document.getElementsByTagName('script')[0];

var jitsi = document.createElement('script');
jitsi.type = 'text/javascript'; 
jitsi.async = true; 
jitsi.defer = true; 
jitsi.src = 'https:/meet.jit.si/external_api.js';
// jitsi.src = 'https://localhost:8443/libs/lib-jitsi-meet.min.js'; 
s.parentNode.insertBefore(jitsi, s);

var api;
var roomSize  = 1;

function init(roomName, roomType){
    const domain = 'meet.jit.si';
    const isLounge = roomType == "lounge";
    const isHb = roomType == "hb";
    const name = isLounge ?  `Product Demo for ${roomName}`:isHb ? `One-One ${roomName}` : `Webinar for ${roomName}`;
    var configOverwrite =  isLounge ? 
    { 
        startWithAudioMuted: true, 
        startAudioOnly: true,
        prejoinPageEnabled: false,
        openBridgeChannel: true
    }:
    isHb ?
    { 
        startWithAudioMuted: true, 
        prejoinPageEnabled: true,
        openBridgeChannel: true
    }:
    { 
        startWithAudioMuted: true, 
        startAudioOnly: true,
        prejoinPageEnabled: false,
        notifications: [
            'connection.CONNFAIL', // shown when the connection fails,
            'dialog.kickTitle', // shown when user has been kicked
            'notify.startSilentTitle', // shown when user joined with no audio
            'prejoin.errorDialOut',
            'prejoin.errorDialOutDisconnected',
            'prejoin.errorDialOutFailed',
            'prejoin.errorDialOutStatus',
            'prejoin.errorStatusCode',
            'prejoin.errorValidation'
        ],
        openBridgeChannel: true
    };
    var interfaceConfigOverwrite = isLounge || isHb ? {
        TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat',
            'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback',  'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help'
        ]
    }:{
        TOOLBAR_BUTTONS: [
            'fullscreen','hangup', 'profile', 'chat','raisehand'
        ]
    };
    const options = {
        roomName:name,
        width: 500,
        height: 500,
        parentNode: document.querySelector('#video'),
        configOverwrite,
        interfaceConfigOverwrite,
        userInfo: {
            displayName: $("#name").val()
        }
    };
    if(isHb){
        $('#exhibitors').hide();
    }else{
        $("#video").hide();
    }
    api = new JitsiMeetExternalAPI(domain, options);
    api.addEventListener('videoConferenceJoined',(_)=>{
        if(isLounge && api.getParticipantsInfo().length > roomSize+1){
            document.getElementById(`alert${roomName}`).innerHTML = '<div class="alert alert-danger" role="alert"> Room is full. Please wait for some more time.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            api.dispose();
            return;
        }
        $('#video').show();
        $("#exhibitors").hide();
    });
    api.addEventListener('videoConferenceLeft',(_)=>{
        api.dispose();
        $("#openModalButton").click();
        $("#exhibitors").show();
    });
    setTimeout(() => {
        api.executeCommand("sendEndpointTextMessage","",$("#email").val());
    },5000);
}

function start(roomName,type) {
    init(roomName,type);
}

function validate(){
    var name = $("#name").val();
    var email = $("#email").val();
    if (name && name.length >0 && email && email.length>4){
        $(".join").prop('disabled', false);
    }else{
        $(".join").prop('disabled', true);
    }
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

$( document ).ready(function() {
    const result = getUrlVars();
    if(result.sz){
        roomSize=Number(result.sz);
    }
});