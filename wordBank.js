const wordBank = {
    characters: [
      "小兔子", "狐狸", "狐狸和小白兔", "熊猫", "小鸟", "大象", "小猫", "小狗", "松鼠", "猴子", "青蛙",
      "蝴蝶", "蜜蜂", "小鱼", "乌龟", "长颈鹿", "狐狸和小白兔", "老虎", "狮子", "猫头鹰", "狐狸和小白兔", "企鹅", "鳄鱼"
    ],
    places: [
      "森林", "海滩", "山洞", "草原", "湖泊", "花园", "树屋", "农场", "城堡", "雨林",
      "沙漠", "冰川", "热气球", "海底", "太空站", "童话小镇", "魔法学校", "地下城", "云端", "彩虹桥"
    ],
    objects: [
      "魔法棒", "宝藏", "神秘地图", "时光机", "魔法书", "彩虹", "星星", "月亮", "钥匙", "望远镜",
      "种子", "气球", "画笔", "音乐盒", "放大镜", "纸飞机", "沙漏", "指南针", "水晶球", "飞毯"
    ],
    themes: [
      "友谊", "勇气", "智慧", "诚实", "创造力", "团结", "责任", "好奇心", "坚持", "同理心",
      "环保", "分享", "梦想", "冒险", "成长", "宽容", "感恩", "自信", "合作", "想象力"
    ]
  };
  
  function getRandomWords(count = 3) {
    const categories = Object.keys(wordBank);
    const selectedWords = [];
  
    for (let i = 0; i < count; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomWord = wordBank[randomCategory][Math.floor(Math.random() * wordBank[randomCategory].length)];
      selectedWords.push(randomWord);
    }
  
    return selectedWords;
  }
  
  module.exports = { getRandomWords };