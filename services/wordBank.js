/*
 * 狐狸与小白兔
 * Copyright (c) 2024 Luwavic
 * 作者: Luwavic
 * 许可证: MIT License
 * GitHub: https://github.com/KawaroX/fox-and-rabbit
 */

const wordBank = {
    characters: [
      "小兔子", "狐狸", "狐狸和小白兔", "熊猫", "小鸟", "大象", "小猫", "小狗", "松鼠", "猴子", "青蛙",
      "蝴蝶", "蜜蜂", "小鱼", "乌龟", "长颈鹿", "狐狸和小白兔", "老虎", "狮子", "猫头鹰", "狐狸和小白兔", "企鹅", "鳄鱼",
      "独角兽", "飞龙", "美人鱼", "精灵", "巫师", "机器人", "外星人", "雪人", "龙猫", "凤凰", "小精灵", "章鱼博士"
    ],
    places: [
      "森林", "海滩", "山洞", "草原", "湖泊", "花园", "树屋", "农场", "城堡", "雨林", "北京航空航天大学主南303", "北京航空航天大学图书馆", 
      "沙漠", "冰川", "热气球", "海底", "太空站", "童话小镇", "魔法学校", "地下城", "云端", "彩虹桥", "北京航空航天大学法学院", "北京航空航天大学TD线", 
      "巧克力工厂", "糖果王国", "时光隧道", "玩具城", "神秘岛屿", "月球基地", "龙巢", "精灵树林", "地心世界", "北京航空航天大学", "水晶宫殿"
    ],
    objects: [
      "魔法棒", "宝藏", "神秘地图", "时光机", "魔法书", "彩虹", "星星", "月亮", "钥匙", "望远镜",
      "种子", "气球", "画笔", "音乐盒", "放大镜", "纸飞机", "沙漏", "指南针", "水晶球", "飞毯",
      "隐形斗篷", "魔法镜子", "会说话的日记", "变身药水", "梦想捕手", "记忆相机", "友谊手环", "星光魔杖", "智慧之眼", "时间转换器"
    ],
    themes: [
      "友谊", "勇气", "智慧", "诚实", "创造力", "团结", "责任", "好奇心", "坚持", "同理心",
      "环保", "分享", "梦想", "冒险", "成长", "宽容", "感恩", "自信", "合作", "想象力", "共产主义",
      "科技与自然和谐", "面对恐惧", "接纳差异", "时间管理", "情绪智能", "批判性思维", "数字素养", "全球意识", "可持续发展"
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