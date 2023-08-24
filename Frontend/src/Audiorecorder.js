import React, { useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const AudioRecorder = ({ onRecordingStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(new MicRecorder({ bitRate: 128 }));

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        recorder.start()
          .then(() => {
            setIsRecording(true);
            alert('Recording started.');
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error('Error accessing microphone:', err);
        alert('Please allow microphone access to record audio.');
      });
  };

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setIsRecording(false);
        onRecordingStop(blob);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {/* <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button> */}
      
      <div onClick={isRecording ? stopRecording : startRecording} style={{ marginLeft: '10px', padding: 5, fontSize: '18px' }}>
        {isRecording ? (
          <i className="fa fa-microphone-slash" aria-hidden="true" />
        ) : (
          <i className="fa fa-microphone" aria-hidden="true" />
        )}
      </div>
    
    </div>
  );
};

export default AudioRecorder;
