/*
 * Tiny sound effects (generated with ElevenLabs). Off until the visitor turns
 * sound on in the sticker tray; remembered in localStorage.
 */
import sSticker from "../../../assets/sfx/sticker.mp3";
import sCoin from "../../../assets/sfx/coin.mp3";
import sHeart from "../../../assets/sfx/heart.mp3";
import sLose from "../../../assets/sfx/lose.mp3";
import sWhoosh from "../../../assets/sfx/whoosh.mp3";
import sScribble from "../../../assets/sfx/scribble.mp3";
import sBoing from "../../../assets/sfx/boing.mp3";
import sParty from "../../../assets/sfx/party.mp3";

export type Sfx = "sticker" | "coin" | "heart" | "lose" | "whoosh" | "scribble" | "boing" | "party";
const SRC: Record<Sfx, string> = { sticker: sSticker, coin: sCoin, heart: sHeart, lose: sLose, whoosh: sWhoosh, scribble: sScribble, boing: sBoing, party: sParty };
const KEY = "alaa-sound";
const EVT = "sound:toggle";
const cache = new Map<Sfx, HTMLAudioElement>();

export function isSoundOn() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
export function setSound(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: on }));
  if (on) play("coin", 0.6);
}
export function onSoundToggle(fn: (on: boolean) => void) {
  const h = (e: Event) => fn((e as CustomEvent<boolean>).detail);
  window.addEventListener(EVT, h);
  return () => window.removeEventListener(EVT, h);
}

export function play(name: Sfx, volume = 0.5) {
  if (!isSoundOn()) return;
  try {
    let a = cache.get(name);
    if (!a) {
      a = new Audio(SRC[name]);
      a.preload = "auto";
      cache.set(name, a);
    }
    a.volume = volume;
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* no audio, no problem */
  }
}
