import { SyntheticEvent, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import VideoControls from './VideoControls';
import VideoTimestamp from './VideoTimestamp';
import VideoSeeker from './VideoSeeker';
import VolumeSlider from './VolumeSlider';
import ButtonIcon from './ButtonIcon';
import InputTimestamp from './InputTimestamp';

type Props = {
  onSplit: (startTime: number, endTime: number) => void;
};

const SplitterSection = ({ onSplit }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [volume, setVolume] = useState(100);
  const [savedVolume, setSavedVolume] = useState<number>();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const reactPlayer = useRef(null);

  const handleOnEnded = () => {
    setPlaying(false);
    setPlayed(totalDuration);
  };

  const handleOnDuration = (duration: number) => {
    setTotalDuration(duration);
  };

  const handleOnProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setPlayed(state.playedSeconds);
  };

  const handleControl = (control: 'Play' | 'Pause') => {
    switch (control) {
      case 'Play':
        setPlaying(true);
        break;
      case 'Pause':
        setPlaying(false);
        break;
      default:
    }
  };

  const handleSeekChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setPlayed(parseInt(target.value, 10));
    if (reactPlayer.current) {
      (reactPlayer.current as ReactPlayer)?.seekTo(parseInt(target.value, 10));
    }
  };

  const handleVolumeChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setVolume(parseInt(target.value, 10));
  };

  const handleOnMute = (prevVolume: number) => {
    setSavedVolume(prevVolume); // save previous volume to restore it later
    setVolume(0);
  };

  const handleOnUnmute = () => {
    if (savedVolume) {
      setVolume(savedVolume); // restore saved volume
    }
  };

  const handleOpenFile = async () => {
    const filePath = await window.api.openFileDialog();
    if (filePath) {
      setVideoUrl(`vsj://${filePath}`);
      setStartTime(0);
      setEndTime(0);
    }
  };

  const handleSelectStartTime = () => {
    setStartTime(played);
  };

  const handleSelectEndTime = () => {
    setEndTime(played);
  };

  const handleChangeStartTime = (seconds: number) => {
    setStartTime(seconds);
    setPlayed(seconds);
    if (reactPlayer.current) {
      (reactPlayer.current as ReactPlayer)?.seekTo(seconds);
    }
  };

  const handleChangeEndTime = (seconds: number) => {
    setEndTime(seconds);
    setPlayed(seconds);
    if (reactPlayer.current) {
      (reactPlayer.current as ReactPlayer)?.seekTo(seconds);
    }
  };

  const handleAddToParts = () => {
    onSplit(startTime, endTime);
  };

  return (
    <div>
      <div className="mb-2 bg-black">
        <ReactPlayer
          ref={reactPlayer}
          url={videoUrl}
          playing={playing}
          volume={volume / 100}
          onEnded={handleOnEnded}
          onDuration={handleOnDuration}
          onProgress={handleOnProgress}
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <VideoSeeker
          played={played}
          totalDuration={totalDuration}
          onChange={handleSeekChange}
        />
        <div className="w-[205px] mx-2.5">
          <VideoTimestamp played={played} totalDuration={totalDuration} />
        </div>
        <div className="w-28">
          <VolumeSlider
            value={volume}
            onChange={handleVolumeChange}
            onMute={handleOnMute}
            onUnmute={handleOnUnmute}
          />
        </div>
      </div>
      <div className="flex">
        <VideoControls
          playing={playing}
          ended={!playing && played !== 0 && played === totalDuration}
          onControl={handleControl}
          disabled={videoUrl === ''}
        />
        <ButtonIcon
          disabled={videoUrl === ''}
          title="Select start time"
          onClick={() => handleSelectStartTime()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"
            />
            <path d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
          </svg>
        </ButtonIcon>
        <ButtonIcon
          disabled={videoUrl === ''}
          title="Select end time"
          onClick={() => handleSelectEndTime()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M14.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z"
            />
            <path d="M13 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
          </svg>
        </ButtonIcon>
        <div className="flex items-center space-x-1">
          <InputTimestamp
            seconds={startTime}
            maxLength={12}
            disabled={videoUrl === ''}
            onChange={(seconds) => handleChangeStartTime(seconds)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
          <InputTimestamp
            seconds={endTime}
            maxLength={12}
            disabled={videoUrl === ''}
            invalid={startTime !== 0 && endTime !== 0 && endTime <= startTime}
            invalidTitle="End time must be greater than start time"
            onChange={(seconds) => handleChangeEndTime(seconds)}
          />
          <ButtonIcon
            disabled={videoUrl === '' || endTime <= startTime}
            title="Add to parts"
            onClick={() => handleAddToParts()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6"
              viewBox="1 1 14 14"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </ButtonIcon>
        </div>
      </div>

      <button type="button" id="videoplayer" onClick={handleOpenFile}>
        Open
      </button>
    </div>
  );
};

export default SplitterSection;
