/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { Fragment, useCallback, useRef, useState } from "react";
import { useMediaContext } from "../context/useMediaContext";

import { MediaObject } from "../components/MediaObject";

export const Audio = ({
  mediaObject: { onLoad, ...mediaObject },
  mediaLoaded,
}: {
  mediaObject: MediaObject;
  mediaLoaded: boolean;
}) => {
  const { getStyles } = useMediaContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const togglePlay = useCallback(
    (evt: React.MouseEvent<HTMLAudioElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
      if (audioRef.current) {
        playing ? audioRef.current.pause() : audioRef.current.play();
        setPlaying(!playing);
      }
    },
    [audioRef, playing]
  );

  return (
    <Fragment>
      {mediaLoaded && (
        <button
          onClick={togglePlay}
          {...getStyles("mediaAudioButton", { playing })}
        >
          {playing ? "Pause" : "Play"}
        </button>
      )}
      <audio
        loop={true}
        ref={audioRef}
        preload="auto"
        onLoadedData={onLoad}
        {...mediaObject}
      />
    </Fragment>
  );
};