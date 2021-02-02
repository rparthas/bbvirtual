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

function init(roomName){
    const domain = 'meet.jit.si';
    const name = `Networking Lounge for ${roomName}`;
    const options = {
        roomName:name,
        width: 500,
        height: 500,
        parentNode: document.querySelector('#video'),
        configOverwrite: { 
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
        },
        interfaceConfigOverwrite:{
            TOOLBAR_BUTTONS: [
                'fullscreen','hangup', 'profile', 'chat','raisehand'
            ],
        },
        userInfo: {
            displayName: $("#name").val(),
            avatarURL: $("#email").val()
        }
    };
    api = new JitsiMeetExternalAPI(domain, options);
    api.executeCommand('email', $("#email").val());
    api.addEventListener('endpointTextMessageReceived',(event)=>{
        $("#scannedText").html(`<div> Scanned this: ${event.data.eventData.text}</div>`);
    });
    api.addEventListener('videoConferenceLeft',(_)=>{
        api.dispose();
        $("#exhibitors").show();
    });
    window.scrollTo(0,document.body.scrollHeight);
}

function start(roomName) {
    init(roomName);
    $("#exhibitors").hide(1000);
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


