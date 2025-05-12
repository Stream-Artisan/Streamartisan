function toggleMenu() {
  const overlay = document.getElementById("overlay");
  if (overlay.style.width === "100%") {
    overlay.style.width = "0";
  } else {
    overlay.style.width = "100%";
  }
}

let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function openMakeCallPopup() {
  document.getElementById("makeCallPopup").style.display = "flex";
}

function closeMakeCallPopup() {
  document.getElementById("makeCallPopup").style.display = "none";
}

async function startAudioCall() {
  document.getElementById("callStatus").textContent = "Starting audio call...";
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setupCall();
  } catch (error) {
    console.error("Error accessing audio devices:", error);
    document.getElementById("callStatus").textContent = "Failed to start audio call.";
  }
}

async function startVideoCall() {
  document.getElementById("callStatus").textContent = "Starting video call...";
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("videoContainer").style.display = "flex";
    document.getElementById("localVideo").srcObject = localStream;
    setupCall();
  } catch (error) {
    console.error("Error accessing video devices:", error);
    document.getElementById("callStatus").textContent = "Failed to start video call.";
  }
}

function setupCall() {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();

  document.getElementById("remoteVideo").srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
    }
  };

  document.getElementById("callStatus").textContent = "Call in progress...";
}
