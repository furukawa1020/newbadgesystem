// Pixel Coordinates based on the "Mountain (Top Right) to Sea (Left)" Hakusan Map
// 0,0 is Top-Left. 100,100 is Bottom-Right.

export const TOWNS = [
  // Shiramine: High in the mountains (Top Right, near the peak)
  { id: 'shiramine', name: '白峰', description: '恐竜と雪の村', lat: 36.173, lng: 136.632, x: 80, y: 15, badgeImage: '1_白峰村.png' },

  // Oguchi: Below Shiramine
  { id: 'oguchi', name: '尾口', description: 'ダムと自然', lat: 36.241, lng: 136.611, x: 70, y: 30, badgeImage: '2_尾口村（仮）.png' },

  // Yoshinodani: Central mountain area
  { id: 'yoshinodani', name: '吉野谷', description: '木工の里', lat: 36.289, lng: 136.602, x: 60, y: 40, badgeImage: '3_吉野谷村.png' },

  // Torigoe: Central, getting lower
  { id: 'torigoe', name: '鳥越', description: '城跡とそば', lat: 36.331, lng: 136.589, x: 50, y: 35, badgeImage: '4_鳥越村.png' },

  // Kawachi: River valley
  { id: 'kawachi', name: '河内', description: '峡谷の村', lat: 36.353, lng: 136.621, x: 65, y: 50, badgeImage: '5_河内村.png' },

  // Tsurugi: The gateway (Bottom/Center Right)
  { id: 'tsurugi', name: '鶴来', description: '白山比咩神社', lat: 36.442, lng: 136.638, x: 65, y: 65, badgeImage: '6_鶴来町.png' },

  // Matto: City plains (Moved Right to be on land)
  { id: 'matto', name: '松任', description: '市の中心', lat: 36.526, lng: 136.565, x: 45, y: 70, badgeImage: '7_松任市.png' },

  // Mikawa: By the sea (Moved Right to be on land edge)
  { id: 'mikawa', name: '美川', description: '港とふぐ', lat: 36.494, lng: 136.502, x: 38, y: 55, badgeImage: '8_美川町.png' },
];
