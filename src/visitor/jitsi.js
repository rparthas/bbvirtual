var s = document.getElementsByTagName('script')[0];

var jitsi = document.createElement('script');
jitsi.type = 'text/javascript'; 
jitsi.async = true; 
jitsi.defer = true; 
jitsi.src = 'https://meet.jit.si/external_api.js';
// jitsi.src = 'https://localhost:8443/libs/lib-jitsi-meet.min.js'; 
s.parentNode.insertBefore(jitsi, s);

var api;

function init(roomName, roomType){
    const domain = 'meet.jit.si';
    const isLounge = roomType == "lounge";
    const isHb = roomType == "hb";
    const name = isLounge ?  `Networking Lounge for ${roomName}`:isHb ? `Hosted Buyer for ${roomName}` : `Webinar for ${roomName}`;
    var configOverwrite =  isLounge ? 
    { 
        startWithAudioMuted: true, 
        startAudioOnly: true,
        prejoinPageEnabled: false,
    }:
    isHb ?
    { 
        startWithAudioMuted: true, 
        prejoinPageEnabled: true,
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
        ]
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
    api = new JitsiMeetExternalAPI(domain, options);
    $("#exhibitors").hide();
    api.addEventListener('videoConferenceLeft',(_)=>{
        api.dispose();
        $("#exhibitors").show();
    });
    window.scrollTo(0,document.body.scrollHeight);
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

