// Pixel Coordinates based on the "Mountain (Top Right) to Sea (Left)" Hakusan Map
// 0,0 is Top-Left. 100,100 is Bottom-Right.

export interface Badge {
  id: string; // The URL slug (e.g., 'shiramine' -> /claim/shiramine)
  name: string; // Display Name
  description: string;
  lat: number;
  lng: number;
  x: number; // Pixel Map X%
  y: number; // Pixel Map Y%
  badgeImage: string;
  realSpotName: string; // The actual Geopark spot name
}

// Force Update: Renamed images to ASCII for Cloudflare compatibility
// Confirmed paths: 'badge_1.png' etc. (NOT /assets/badges/...)
export const TOWNS: Badge[] = [
  // Shiramine (mountain reference: x:80, y:15)
  {
    id: 'shiramine',
    name: '白峰',
    realSpotName: '白峰重要伝統的建造物群保存地区',
    description: '雪だるまと伝統的建造物の町並み',
    lat: 36.166, lng: 136.632,
    x: 80, y: 15,
    badgeImage: 'badge_1.png'
  },
  // Oguchi
  {
    id: 'oguchi',
    name: '尾口',
    realSpotName: '手取川ダム',
    description: '巨大なロックフィルダム',
    lat: 36.241, lng: 136.611,
    x: 72, y: 25,
    badgeImage: 'badge_2.png'
  },
  // Yoshinodani
  {
    id: 'yoshinodani',
    name: '吉野谷',
    realSpotName: '綿ヶ滝',
    description: '手取峡谷の絶景スポット',
    lat: 36.289, lng: 136.602,
    x: 66, y: 31,
    badgeImage: 'badge_3.png'
  },
  // Torigoe
  {
    id: 'torigoe',
    name: '鳥越',
    realSpotName: '鳥越城跡',
    description: '一向一揆の歴史を伝える山城',
    lat: 36.331, lng: 136.589,
    x: 61, y: 37,
    badgeImage: 'badge_4.png'
  },
  // Kawachi
  {
    id: 'kawachi',
    name: '河内',
    realSpotName: '河内千丈温泉',
    description: '美肌の湯として知られる温泉',
    lat: 36.353, lng: 136.621,
    x: 57, y: 29,
    badgeImage: 'badge_5.png'
  },
  // Tsurugi
  {
    id: 'tsurugi',
    name: '鶴来',
    realSpotName: 'パーク獅子吼',
    description: 'ゴンドラでスカイ獅子吼へ',
    lat: 36.442, lng: 136.638,
    x: 45, y: 30,
    badgeImage: 'badge_6.png'
  },
  // Matto (sea reference: x:38, y:55)
  {
    id: 'matto',
    name: '松任',
    realSpotName: '松任海浜公園',
    description: '日本海を望む広大な公園',
    lat: 36.526, lng: 136.565,
    x: 38, y: 55,
    badgeImage: 'badge_7.png'
  },
  // Mikawa (sea reference: x:45, y:70)
  {
    id: 'mikawa',
    name: '美川',
    realSpotName: '美川県民の森',
    description: '手取川河口の自然',
    lat: 36.494, lng: 136.502,
    x: 45, y: 70,
    badgeImage: 'badge_8.png'
  },
];
