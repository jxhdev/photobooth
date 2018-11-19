let width = 320;
let height = 320;
let videoStream = null;
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let photo = document.getElementById('photo');
let startbutton = document.getElementById('startbutton');
let capturebutton = document.getElementById('capturebutton');

// Test browser support
window.navigator = window.navigator || {};
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  null;

if (navigator.getUserMedia === null) {
  document.getElementById('gum-unsupported').classList.remove('hidden');
  document
    .getElementById('button-play-gum')
    .setAttribute('disabled', 'disabled');
  document
    .getElementById('button-stop-gum')
    .setAttribute('disabled', 'disabled');
} else {
  // Opera <= 12.16 accepts the direct stream.
  // More on this here: http://dev.opera.com/articles/view/playing-with-html5-video-and-getusermedia-support/
  var createSrc = window.URL
    ? window.URL.createObjectURL
    : function(stream) {
        return stream;
      };

  // Opera <= 12.16 support video only.
  var audioContext = window.AudioContext || window.webkitAudioContext || null;
  if (audioContext === null) {
    document
      .getElementById('gum-partially-supported')
      .classList.remove('hidden');
  }

  document.getElementById('startbutton').addEventListener('click', function() {
    // Capture user's audio and video source
    navigator.getUserMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        videoStream = stream;
        // Stream the data
        video.src = createSrc(stream);
        video.play();
      },
      function(error) {
        console.log('Video capture error: ', error.code);
      }
    );
  });
  document
    .getElementById('button-stop-gum')
    .addEventListener('click', function() {
      // Pause the video
      video.pause();
      // Stop the stream
      videoStream.stop();
    });
}

capturebutton.addEventListener(
  'click',
  evt => {
    takepicture();
    evt.preventDefault();
  },
  false
);

function takepicture() {
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    photo.style.display = 'block';
  } else {
    clearphoto();
  }
}

function clearphoto() {
  let context = canvas.getContext('2d');
  context.fillStyle = '#AAA';
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}
