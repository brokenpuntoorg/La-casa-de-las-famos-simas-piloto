export type LovelyId =
  | 'navely'
  | 'jeongvely'
  | 'movely'
  | 'savely'
  | 'jively'
  | 'mively'
  | 'davely'
  | 'chaengvely'
  | 'tzuvely';

export type HouseStatus = 'NOMINADA' | 'SALVA' | 'LIDER_INMUNE' | 'FAVORITA_TOP' | 'ELIMINADA';

export interface Lovely {
  id: LovelyId;
  name: string;
  member: string;
  hangul: string;
  colorHex: string;
  accentBg: string;
  glowColor: string;
  earType: 'bunny' | 'bear' | 'cat' | 'puppy' | 'round';
  roleInHouse: string;
  status: HouseStatus;
  votes: number;
  votePercentage: number;
  rank: number;
  previousRank: number;
  bio: string;
  famousQuote: string;
  houseScandal: string;
  defenseSpeech?: string;
  stats: {
    charisma: number;
    drama: number;
    strategy: number;
    popularity: number;
  };
  nominatedReason?: string;
  fandomAlliance: string;
}

export interface Confession {
  id: string;
  authorName: string;
  lovelyId?: LovelyId;
  isHousemate: boolean;
  message: string;
  timestamp: string;
  likes: number;
  tag: string;
}

export interface RealityCam {
  id: string;
  name: string;
  location: string;
  currentActivity: string;
  occupants: LovelyId[];
  isHotSpot: boolean;
}

export interface GalaWeek {
  weekNumber: number;
  title: string;
  theme: string;
  eliminationDate: string;
  isCurrent: boolean;
  nominatedIds: LovelyId[];
  leaderId: LovelyId;
}
