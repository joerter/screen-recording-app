import './App.css';
import { ScreenRecordingState, useScreenRecording } from './useScreenRecording';

function App() {
  const [screenRecordingState, toggleIsRecording] = useScreenRecording();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Screen Recording App</h1>

        <button onClick={toggleIsRecording}>
          {screenRecordingState.isRecording
            ? 'Stop Recording'
            : 'Start Recording'}
        </button>
      </header>

      <main>
        {screenRecordingState.recordingObjectUrl != null && (
          <video controls src={screenRecordingState.recordingObjectUrl}></video>
        )}
      </main>
    </div>
  );
}

export default App;
