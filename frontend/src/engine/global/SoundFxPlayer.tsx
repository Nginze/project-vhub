import { useSoundEffectStore, soundEffects } from "@/global-store/SoundFxStore";

const soundKeys = Object.keys(soundEffects);

const SoundEffectPlayer = () => {
  const add = useSoundEffectStore((x) => x.add);

  return (
    <>
      {soundKeys.map((key) => (
        <audio
          preload="none"
          controls={false}
          key={key}
          ref={(ref) => {
            if (ref) {
              ref.volume = 0.7;
              add(key, ref);
            }
          }}
          src={`/assets/sound-effects/${
            soundEffects[key as keyof typeof soundEffects]
          }`}
        />
      ))}
    </>
  );
};

export default SoundEffectPlayer;
