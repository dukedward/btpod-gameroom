import { BLACK_TWITTER } from "./BLACK_TWITTER.js";
import { CHURCH } from "./CHURCH.js";
import { DAILY_SAYINGS } from "./DAILY_SAYINGS.js";
import { FAMILY_FRIENDS } from "./FAMILY_FRIENDS.js";
import { SONGS_LYRICS } from "./SONGS_LYRICS.js";
import { TV_FILM } from "./TV_FILM.js";
import { WORDS_TO_LIVE_BY } from "./WORDS_TO_LIVE_BY.js";

export const CULTURE_TAGS_CATEGORIES = [
  "Black Twitter",
  "Church",
  "Daily Sayings",
  "Family & Friends",
  "Songs & Lyrics",
  "TV & Film",
  "Words to Live By",
];

// phrase -> acronym (auto-generated) + category
export const CULTURE_TAGS_PHRASES = {
  "Black Twitter": BLACK_TWITTER,
  Church: CHURCH,
  "Daily Sayings": DAILY_SAYINGS,
  "Family & Friends": FAMILY_FRIENDS,
  "Songs & Lyrics": SONGS_LYRICS,
  "TV & Film": TV_FILM,
  "Words to Live By": WORDS_TO_LIVE_BY,
};

export function generateAcronym(phrase) {
  return phrase
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
}
