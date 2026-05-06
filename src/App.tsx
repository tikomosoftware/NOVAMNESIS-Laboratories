import { useState } from "react";

type Plan = {
  title: string;
  description: string;
  category: string;
  duration: string;
  memorySpan: string;
  risk: string;
  source: string;
};

type Tone = "dark" | "light" | "corporate";

type SimpleCard = {
  title: string;
  description: string;
};

type Faq = {
  question: string;
  answer: string;
};

type PurchaseUseCase = SimpleCard & {
  label: string;
  desire: string;
  examples: string[];
  startingPrice: string;
};

type Review = {
  quote: string;
  memory: string;
  effect: string;
  participant: string;
};

type ExperienceTemplate = SimpleCard & {
  slug: string;
  tagline: string;
  duration: string;
  memorySpan: string;
  risk: string;
  chapters: string[];
  sensations: string[];
  recommendedPlans: string[];
};

type MemoryEpisode = SimpleCard & {
  slug: string;
  period: string;
  intensity: string;
  tag: string;
  source: string;
  synopsis: string;
  timeline: string[];
  details: string[];
  sensations: string[];
  purchaseNotes: string[];
};

const siteNavItems = [
  { label: "Catalog", href: "/catalog" },
  { label: "Experience", href: "/experience" },
  { label: "Facility", href: "/facility" },
  { label: "Safety", href: "/safety" },
  { label: "Sell Memory", href: "/sell" },
  { label: "FAQ", href: "/#faq" },
];

const landingNavItems = siteNavItems;
const catalogNavItems = siteNavItems;
const companyNavItems = siteNavItems;
const sellNavItems = siteNavItems;
const facilityNavItems = siteNavItems;

const sessionSteps = [
  {
    title: "受付と境界タグの確認",
    time: "00:00-08:00",
    description: "体験する記憶の種類、強度、残したい余韻を確認します。本人同意、現実の記憶との境界タグ、途中停止の合図をここで固定します。",
  },
  {
    title: "リクライニングポッドへ着席",
    time: "08:00-12:00",
    description: "体温、脈拍、眼球運動を取りながら、首と肩が緩む角度に調整します。拘束ではなく、眠りに落ちる前の姿勢を保つための支持です。",
  },
  {
    title: "ニューロクラウン装着",
    time: "12:00-18:00",
    description: "こめかみ、後頭部、額に柔らかいセンサーを当てます。髪を剃る必要はなく、微弱な冷感と軽い圧だけが残ります。",
  },
  {
    title: "記憶定着フェーズ",
    time: "18:00-46:00",
    description: "意識は浅い睡眠に近く、音は遠く聞こえます。映像を見るというより、匂い、重さ、声、気まずさ、嬉しさが順番に自分の経験として結びつきます。",
  },
  {
    title: "覚醒と現実復帰",
    time: "46:00-60:00",
    description: "名前、日付、現在地、購入した記憶であることを確認します。余韻が強い場合は照明を落としたまま、認知安定セッションを延長します。",
  },
];

const roomZones = [
  {
    title: "Preparation Lounge",
    description: "白い診察室ではなく、低い照明と吸音パネルのある待機室です。体験前の緊張を下げるため、説明はすべて座ったまま受けられます。",
  },
  {
    title: "Memory Fixation Pod",
    description: "頭部センサー、香気カートリッジ、骨伝導音響、体圧制御シートを一体化した定着用チェアです。利用者は常にスタッフの視界内にいます。",
  },
  {
    title: "Return Bay",
    description: "覚醒後にすぐ現実へ戻しすぎないための小部屋です。水、鏡、日付表示、短い会話で、購入した記憶と今日の自分を分け直します。",
  },
];

const bodyStates = [
  "まぶたは閉じたままでも、記憶の中では視界が立ち上がる",
  "身体は椅子にあるが、足裏や指先に別の場所の感触が残る",
  "強い場面では脈拍が上がるため、自動的に再生速度が落ちる",
  "声を出せない状態ではなく、違和感があれば停止ワードで中断できる",
  "終了直後は夢より鮮明で、現実の出来事より少しだけ輪郭が柔らかい",
];

const experienceEntryOptions = [
  {
    title: "短い思い出から試す",
    description: "放課後の告白、旅先の朝、試合前の緊張など、人生のポイントになる場面を軽く体験します。",
    meta: "ポイント記憶",
    sessionSpan: "30-60分",
    memorySpan: "数十分-数日分",
  },
  {
    title: "選ばなかった人生を体験する",
    description: "結婚、仕事、移住、別の役割など、現実では選ばなかった人生の分岐を数年単位の記憶として受け取ります。",
    meta: "人生分岐記憶",
    sessionSpan: "60分 x 複数回",
    memorySpan: "6か月-10年分",
  },
  {
    title: "強い物語記憶に入る",
    description: "ヒーロー、異世界、極限体験など、感情の振れ幅が大きい記憶を段階的に定着させます。",
    meta: "物語記憶",
    sessionSpan: "60分から",
    memorySpan: "数日-数年分",
  },
];

const intakeChecks = [
  "体験したい記憶の種類",
  "残したい余韻の強さ",
  "現実と混同しやすい出来事の有無",
  "避けたい感情や場面",
  "終了後に必要な休憩時間",
];

const bookingSteps = [
  "体験内容の確認",
  "希望日時の選択",
  "来館前説明の予約",
  "同意事項の確認",
];

const plans: Plan[] = [
  {
    title: "Secret Agent Mission",
    description: "誰にも知られず世界の均衡を保つ、匿名化済み潜入任務。",
    category: "Covert Hero",
    duration: "42分",
    memorySpan: "11日間",
    risk: "Medium",
    source: "ハイブリッド",
  },
  {
    title: "Mars Colony Escape",
    description: "赤い惑星の薄い空気と警報音の中、植民地から脱出する。",
    category: "SF Survival",
    duration: "50分",
    memorySpan: "3週間",
    risk: "High",
    source: "人工生成",
  },
  {
    title: "Executive Success",
    description: "巨大企業のCEOとして、ひとつの決断で市場を動かす。",
    category: "Career Elite",
    duration: "35分",
    memorySpan: "18カ月",
    risk: "Low",
    source: "匿名化済み実体験",
  },
  {
    title: "Lost Romance",
    description: "すでに終わったはずの恋を、記憶の中でもう一度だけ。",
    category: "Romance",
    duration: "38分",
    memorySpan: "6週間",
    risk: "Medium",
    source: "匿名化済み実体験",
  },
  {
    title: "Deep Space Vacation",
    description: "深宇宙クルーズの静寂と、窓外に浮かぶ知らない光。",
    category: "Luxury Travel",
    duration: "47分",
    memorySpan: "9日間",
    risk: "Low",
    source: "人工生成",
  },
  {
    title: "Heroic Rescue",
    description: "絶体絶命の現場で、誰かの未来を取り戻した記憶。",
    category: "Hero",
    duration: "44分",
    memorySpan: "72時間",
    risk: "High",
    source: "ハイブリッド",
  },
  {
    title: "Stadium Legend Final",
    description: "満員のスタジアムで、最後の一球に人生を預けるトップアスリート体験。",
    category: "Sports Career",
    duration: "40分",
    memorySpan: "14年間",
    risk: "Medium",
    source: "ハイブリッド",
  },
  {
    title: "World Tour Artist",
    description: "照明、歓声、震える指先。世界ツアー初日のステージに立つ記憶。",
    category: "Artist Career",
    duration: "36分",
    memorySpan: "8カ月",
    risk: "Low",
    source: "匿名化済み実体験",
  },
  {
    title: "Virtual Hero Origin",
    description: "誰も知らない街で目覚め、はじめて誰かを救う仮想ヒーロー誕生譚。",
    category: "Virtual Hero",
    duration: "48分",
    memorySpan: "21日間",
    risk: "Medium",
    source: "人工生成",
  },
  {
    title: "Neon Heroine Protocol",
    description: "企業都市の夜を駆け抜け、失われた真実に手を伸ばすヒロイン体験。",
    category: "Virtual Heroine",
    duration: "46分",
    memorySpan: "12日間",
    risk: "Medium",
    source: "人工生成",
  },
  {
    title: "Isekai Rebirth Archive",
    description: "見知らぬ王都で第二の名前を与えられ、選ばなかった人生を始める。",
    category: "Another World",
    duration: "55分",
    memorySpan: "2年間",
    risk: "High",
    source: "人工生成",
  },
  {
    title: "Royal Academy Spellcraft",
    description: "魔術と政治が交差する学院で、才能と秘密を抱えて卒業式を迎える。",
    category: "Fantasy Career",
    duration: "52分",
    memorySpan: "3年間",
    risk: "Medium",
    source: "人工生成",
  },
];

const purchaseUseCases: PurchaseUseCase[] = [
  {
    label: "青春を補う",
    title: "学生時代の恋愛を、後から人生に足す。",
    desire: "恋愛に踏み出せなかった人へ",
    description:
      "放課後の告白、文化祭の帰り道、卒業式で言えなかった一言。派手な成功ではなく、胸が少し痛むくらいの青春を購入できます。",
    examples: ["放課後の教室で告白する", "雨の日に相合傘で帰る", "卒業前日に返事をもらう"],
    startingPrice: "Short Memory / 3時間から",
  },
  {
    label: "後悔をほどく",
    title: "結婚した人生、独身だった人生を体験する。",
    desire: "選ばなかった分岐が残っている人へ",
    description:
      "結婚式の朝、子どもを寝かしつけた夜、ひとりで海外赴任を選んだ朝。どちらが正解だったかではなく、選ばなかった人生にも触れて後悔を小さくします。",
    examples: ["結婚した世界線の10年間", "独身で仕事に振り切った5年間", "離婚後に自分を取り戻す半年"],
    startingPrice: "Life Branch / 6か月から",
  },
  {
    label: "成功を味わう",
    title: "成功した自分の記憶を、現実の背中に入れる。",
    desire: "届かなかった舞台がある人へ",
    description:
      "CEOとして決断した日、国体決勝で名前を呼ばれた瞬間、作品が初めて評価された夜。勝った結果だけでなく、そこまでの緊張も含めて残します。",
    examples: ["大企業のCEOとして買収を決断する", "全国大会の決勝に立つ", "初個展で作品が売れる"],
    startingPrice: "Achievement / 2日から",
  },
  {
    label: "旅を取り戻す",
    title: "行けなかった旅行を、思い出として持ち帰る。",
    desire: "時間がなかった人へ",
    description:
      "若い頃に行きたかったヨーロッパ一人旅、家族で見たかった海、老後まで延ばしていた世界一周。写真ではなく、移動の疲れや朝の空気まで記憶にします。",
    examples: ["学生最後のヨーロッパ周遊", "新婚旅行で見た南の海", "退職後の世界一周クルーズ"],
    startingPrice: "Travel Archive / 9日から",
  },
  {
    label: "人生を反転する",
    title: "性別や役割を入れ替えた人生を経験する。",
    desire: "別の身体、別の社会的位置から生きたかった人へ",
    description:
      "男性として、女性として、親として、子として、ヒーローとして、ヒロインとして。現実の自己を壊さず、別の視点で人生を眺めるための大きな記憶テンプレートです。",
    examples: ["別の性別で迎える成人式", "物語のヒロインとして選択する夜", "家族を支える側の20年"],
    startingPrice: "Identity Template / 30日から",
  },
  {
    label: "痛みを得る",
    title: "挫折や失敗を、人生の奥行きとして取り入れる。",
    desire: "負けた経験が少ない人へ",
    description:
      "県大会で負けた帰りのバス、失恋した駅のホーム、事業に失敗して謝罪に向かう朝。傷つくためではなく、他人の痛みを想像できる人生にするための記憶です。",
    examples: ["最後の試合でベンチのまま終わる", "好きな人に選ばれない", "起業に失敗し、もう一度始める"],
    startingPrice: "Failure Memory / 6時間から",
  },
];

const experienceMenus: ExperienceTemplate[] = [
  {
    slug: "sports-athlete",
    title: "スポーツ選手の人生",
    tagline: "勝ち続けた身体と、負けた夜の記憶まで。",
    description: "プロ契約、代表選考、決勝戦、引退試合まで。身体感覚と歓声を中心に構成された競技人生テンプレート。",
    duration: "45分",
    memorySpan: "12〜18年",
    risk: "Medium",
    chapters: ["才能を疑われた少年期", "プロ契約の朝", "代表落選の通知", "決勝戦のラストプレー", "引退試合の静かな更衣室"],
    sensations: ["肺が焼けるような sprint 感", "スタジアムの低い振動", "テーピングの圧迫", "歓声が一瞬だけ遠のく感覚"],
    recommendedPlans: ["Stadium Legend Final", "Heroic Rescue", "Professional Mastery"],
  },
  {
    slug: "artist-life",
    title: "アーティストの人生",
    tagline: "観客の熱狂より先に、誰にも見られない孤独を体験する。",
    description: "初舞台、創作の孤独、世界ツアー、観客の熱狂。才能を持って生きた記憶の連続体験。",
    duration: "42分",
    memorySpan: "9〜14年",
    risk: "Low",
    chapters: ["誰にも届かなかった初期作品", "初舞台の照明", "徹夜明けの完成", "世界ツアー初日の歓声", "ヒット後に変わった友人の目"],
    sensations: ["指先に残る緊張", "ステージ床の微振動", "作業部屋の夜気", "観客が同じ歌詞を返す瞬間"],
    recommendedPlans: ["World Tour Artist", "Lost Romance", "Deep Space Vacation"],
  },
  {
    slug: "professional-mastery",
    title: "職業マスタリー",
    tagline: "努力の年月を、手つきと判断の記憶として受け取る。",
    description: "料理人、建築家、研究者、職人、交渉人。熟練した手つきや判断力だけを安全に抽出したキャリア記憶。",
    duration: "39分",
    memorySpan: "10〜25年",
    risk: "Low",
    chapters: ["基礎だけを繰り返す日々", "初めて任された現場", "失敗で覚えた温度", "無意識に動く手", "後輩に技術を渡す午後"],
    sensations: ["道具の重さ", "空気の湿度を読む感覚", "判断前の沈黙", "身体が先に答えを出す違和感"],
    recommendedPlans: ["Executive Success", "Professional Mastery", "Royal Academy Spellcraft"],
  },
  {
    slug: "virtual-hero",
    title: "仮想ヒーロー",
    tagline: "誰かを救った過去を、現実に傷を残さず持ち帰る。",
    description: "都市の危機、正体を隠す日常、誰かを救う瞬間。現実には存在しない英雄譚を記憶として残します。",
    duration: "50分",
    memorySpan: "30日間",
    risk: "Medium",
    chapters: ["力に気づいた最初の夜", "正体を隠す朝", "助けられなかった一人", "都市を救う選択", "誰にも称賛されない帰宅"],
    sensations: ["高所の風圧", "心拍と警報の同期", "手のひらに残る熱", "群衆の中で一人だけ違う記憶"],
    recommendedPlans: ["Virtual Hero Origin", "Heroic Rescue", "Secret Agent Mission"],
  },
  {
    slug: "virtual-heroine",
    title: "仮想ヒロイン",
    tagline: "物語の中心に立つ強さと、その代償を静かに記録する。",
    description: "陰謀、友情、選択、覚醒。物語の中心に立つ人生を、過度な恐怖ではなく静かな没入感で設計します。",
    duration: "48分",
    memorySpan: "45日間",
    risk: "Medium",
    chapters: ["知らない手紙を受け取る", "味方だと思った人の裏切り", "逃げずに選ぶ夜", "能力の覚醒", "平穏に戻れない朝"],
    sensations: ["濡れた路地の匂い", "秘密を抱える胸の重さ", "覚醒時の視界ノイズ", "名前を呼ばれた瞬間の安心"],
    recommendedPlans: ["Neon Heroine Protocol", "Lost Romance", "Secret Agent Mission"],
  },
  {
    slug: "isekai-rebirth",
    title: "異世界転生",
    tagline: "第二の名前で目覚め、選ばれなかった人生を始める。",
    description: "第二の名前、知らない言語、選ばれた役割。現実と混同しない境界タグ付きのファンタジー記憶。",
    duration: "55分",
    memorySpan: "2〜3年",
    risk: "High",
    chapters: ["知らない天井で目覚める", "第二の名前を与えられる", "言葉が急に理解できる朝", "最初の戦闘ではなく最初の食事", "戻るか残るかを選ぶ扉"],
    sensations: ["知らない文字が読める違和感", "石畳の冷たさ", "初めて使う魔法の反動", "帰り道を忘れそうになる感覚"],
    recommendedPlans: ["Isekai Rebirth Archive", "Royal Academy Spellcraft", "Mars Colony Escape"],
  },
];

const memoryEpisodes: MemoryEpisode[] = [
  {
    slug: "after-school-confession",
    title: "放課後、誰にも言えなかった告白",
    description: "文化祭の片付け後、夕方の教室で好きだった人と二人だけになる青春恋愛記憶。",
    period: "記憶内期間: 3時間",
    intensity: "感情強度: 86",
    tag: "青春 / 恋愛",
    source: "匿名化済み実体験",
    synopsis:
      "文化祭の片付けが終わり、校舎が少しずつ静かになっていく夕方。借りたままだった工具箱を返しに教室へ戻ると、ずっと好きだった相手が黒板の前で一人、貼り紙を剥がしている。会話は何気ない片付けの話から始まり、廊下の足音が遠ざかるほど、言えなかった言葉だけが大きくなる。",
    timeline: [
      "16:12 文化祭の片付け後、机を戻す音だけが教室に残る。",
      "16:27 相手が黒板の端に残ったテープを剥がしながら、昨日の出し物の失敗を笑う。",
      "16:49 雨が降り始め、帰る理由が少しだけ遅れる。",
      "17:03 誰もいない廊下で、相手が『今日で終わるの、少し寂しいね』と言う。",
      "17:18 告白するか、いつもの冗談で終わらせるかを選ぶ数十秒。",
    ],
    details: [
      "購入時に、告白が成功する版、返事を保留される版、言えないまま終わる版を選択できます。",
      "相手の顔、名前、学校名は匿名化され、購入者の記憶内では識別不能な架空人物として再構成されます。",
      "甘いだけではなく、言葉を飲み込む怖さや、放課後特有の寂しさも残す設計です。",
      "体験後は『自分の実際の学生時代ではない』と認識できる境界タグが付与されます。",
    ],
    sensations: ["夕方の教室の埃っぽい匂い", "雨が窓に当たる小さな音", "手の中で潰れかけた紙コップ", "相手が笑った直後の沈黙", "心臓の音だけが近くなる感覚"],
    purchaseNotes: [
      "恋愛記憶への憧れが強い方は、体験後に軽い郷愁が残る場合があります。",
      "実在の特定人物を指定することはできません。",
      "失恋版を選ぶ場合、体験後に短い認知安定ガイダンスが推奨されます。",
    ],
  },
  {
    slug: "koshien-bench-summer",
    title: "最後の夏、ベンチから見た甲子園",
    description: "レギュラーになれなかったまま、仲間の打席を見つめる高校野球の挫折と誇り。",
    period: "記憶内期間: 9日間",
    intensity: "感情強度: 91",
    tag: "部活 / 挫折",
    source: "匿名化済み実体験",
    synopsis: "最後の夏、背番号をもらったのに試合には出られない。歓声の外側で仲間を信じる、短くて苦い競技記憶。",
    timeline: ["地方大会の朝", "ベンチ入り発表", "甲子園の土を初めて踏む", "仲間の打席を祈る", "帰りのバスで泣かないと決める"],
    details: ["出場版ではなく、出られなかった側の誇りを中心に構成します。", "学校名や実在大会情報は再構成されます。"],
    sensations: ["ベンチの熱", "ユニフォームの汗", "金属バットの音", "声を枯らす喉"],
    purchaseNotes: ["挫折記憶のため、競技経験者には強く残る場合があります。"],
  },
  {
    slug: "national-sports-final",
    title: "国体決勝、名前を呼ばれる瞬間",
    description: "地元代表としてコートに立ち、観客席の家族を見つける数秒を中心に構成した競技記憶。",
    period: "記憶内期間: 2日間",
    intensity: "感情強度: 88",
    tag: "スポーツ / 達成",
    source: "ハイブリッド",
    synopsis: "地元代表として名前を呼ばれ、観客席に家族を見つける一瞬を中心に構成した達成記憶。",
    timeline: ["前日練習", "代表ジャージに袖を通す", "名前を呼ばれる", "最初のプレー", "試合後の握手"],
    details: ["競技種目は購入時に選択できます。", "達成感を中心に、過度な勝利万能感を抑えて調整します。"],
    sensations: ["体育館の床の反発", "会場アナウンス", "手汗", "観客席の光"],
    purchaseNotes: ["達成記憶のため、自己評価への一時的な影響があります。"],
  },
  {
    slug: "after-olympics-airport",
    title: "オリンピックのあと、空港で一人になる",
    description: "大舞台の熱狂が終わった翌朝、メダルよりも静けさが残るアスリートの余韻。",
    period: "記憶内期間: 36時間",
    intensity: "感情強度: 79",
    tag: "スポーツ / 余韻",
    source: "匿名化済み実体験",
    synopsis: "大舞台の熱が過ぎた翌朝、誰もいない空港で、自分がもう競技後の人間になったと気づく記憶。",
    timeline: ["閉会式後のホテル", "早朝の空港", "荷物検査でメダルを出す", "搭乗口で一人になる", "帰国後の静かな車窓"],
    details: ["勝利よりも、終わった後の空白を中心に構成します。", "競技や国名は架空化されます。"],
    sensations: ["空港の冷房", "首に残るメダルの重さ", "眠れない目", "拍手の残響"],
    purchaseNotes: ["喪失感に近い余韻が残る可能性があります。"],
  },
  {
    slug: "kindergarten-way-home",
    title: "幼稚園の帰り道、手を離した日",
    description: "小さな靴、夕方の匂い、初めて一人で門を出た幼少期の自立記憶。",
    period: "記憶内期間: 40分",
    intensity: "感情強度: 64",
    tag: "幼少期 / 原風景",
    source: "匿名化済み実体験",
    synopsis: "初めて保護者の手を離し、自分の足で門を出る。小さな自立だけが世界を広くする幼少期記憶。",
    timeline: ["帰りの支度", "門の前", "手を離す", "振り返る", "家までの短い道"],
    details: ["幼少期記憶のため、柔らかく抽象度を高めて再構成します。", "保護者像は個人が特定されない形に置換されます。"],
    sensations: ["小さな靴の硬さ", "夕方の土の匂い", "手のひらの温度", "大きすぎる空"],
    purchaseNotes: ["幼少期への郷愁が強い方は余韻が残る場合があります。"],
  },
  {
    slug: "praised-in-art-room",
    title: "美術室で褒められた一枚",
    description: "自分でも知らなかった才能を、先生の一言で信じかける学生時代の創作記憶。",
    period: "記憶内期間: 1週間",
    intensity: "感情強度: 72",
    tag: "学生 / 才能",
    source: "ハイブリッド",
    synopsis: "美術室の隅で描いた一枚を、初めて誰かが本気で見てくれる。才能を信じかける記憶。",
    timeline: ["放課後の美術室", "描き直しの迷い", "先生の沈黙", "一言だけ褒められる", "帰り道に絵を見返す"],
    details: ["創作ジャンルは絵、音楽、文章から選べます。", "承認欲求が強く残りすぎないよう調整します。"],
    sensations: ["絵の具の匂い", "紙のざらつき", "夕日の色", "褒められた後の耳の熱さ"],
    purchaseNotes: ["創作意欲が一時的に高まる場合があります。"],
  },
  {
    slug: "first-school-festival-lead",
    title: "初めて主役を任された文化祭",
    description: "練習の失敗、舞台袖の暗さ、本番で名前を呼ばれるまでの短い演劇記憶。",
    period: "記憶内期間: 14日間",
    intensity: "感情強度: 83",
    tag: "青春 / 舞台",
    source: "人工生成",
    synopsis: "失敗続きの練習を越えて、文化祭の舞台袖で自分の名前を待つ短編記憶。",
    timeline: ["配役発表", "台詞を忘れる練習日", "衣装合わせ", "舞台袖の暗さ", "拍手の中で礼をする"],
    details: ["演劇、バンド、ダンスなどの舞台種別を選択できます。", "成功版と小さな失敗込み版を選べます。"],
    sensations: ["舞台袖の埃", "照明の熱", "喉の乾き", "拍手の壁"],
    purchaseNotes: ["人前に立つ記憶のため、軽い高揚が残ります。"],
  },
  {
    slug: "bus-after-prefectural-loss",
    title: "県大会で負けた帰りのバス",
    description: "誰も話さない車内、窓に映る自分の顔、悔しさが少しだけ未来に変わる記憶。",
    period: "記憶内期間: 6時間",
    intensity: "感情強度: 90",
    tag: "部活 / 敗北",
    source: "匿名化済み実体験",
    synopsis: "県大会で負けた帰り道。誰も喋らないバスの中で、悔しさが少しだけ未来に変わる記憶。",
    timeline: ["試合終了の笛", "整列", "荷物をまとめる", "無言のバス", "窓に映る自分を見る"],
    details: ["競技種目は購入時に選べます。", "敗北の痛みと、それでも続けたい感情を残します。"],
    sensations: ["濡れたタオル", "バスの振動", "泣きそうな喉", "窓に反射する顔"],
    purchaseNotes: ["挫折体験のため、体験後に短い安定プロトコルを推奨します。"],
  },
];

const valuation: SimpleCard[] = [
  { title: "感情強度", description: "歓喜、喪失、緊張、安堵など、記憶に残る感情の深さを測定します。" },
  { title: "希少性", description: "一般的には体験困難な状況、職能、場所、人生局面ほど高く評価されます。" },
  { title: "物語性", description: "始まり、転機、結末がある記憶は、体験商品として再構成しやすくなります。" },
  { title: "感覚情報の鮮明さ", description: "匂い、温度、音、身体感覚の密度が没入度の基礎になります。" },
  { title: "倫理審査レベル", description: "第三者情報や心理負荷を評価し、安全な流通範囲を決定します。" },
  { title: "再体験需要", description: "購入者が求める願望、学習、憧れとの一致度を分析します。" },
];

const categories: SimpleCard[] = [
  { title: "First Love Memory", description: "初恋、告白、失恋、再会など、感情強度の高い記憶。" },
  { title: "Extreme Survival", description: "遭難、災害、極限状態からの生還など、危険度の高い体験。" },
  { title: "Professional Mastery", description: "一流職人、外科医、音楽家、アスリートなどの熟練体験。" },
  { title: "Executive Decision", description: "経営判断、交渉、勝負の瞬間など、責任ある立場の記憶。" },
  { title: "Hidden Travel", description: "普通の観光では得られない、個人的で濃密な旅の記憶。" },
  { title: "Farewell Archive", description: "別れ、喪失、卒業、人生の転機に関する記憶。" },
];

const sellSteps = [
  "事前カウンセリング",
  "記憶候補の登録",
  "感情強度・希少性スキャン",
  "匿名化・第三者情報除去",
  "倫理審査",
  "価格査定",
  "ライセンス契約",
  "マーケットプレイス掲載",
];

const safetyItems = [
  "記憶挿入前の心理スキャン",
  "記憶と現実の境界維持プロトコル",
  "緊急覚醒システム",
  "認定ニューロエンジニア監修",
  "体験後の認知安定セッション",
  "記憶混同リスクの事前評価",
  "高リスク記憶の段階的再生制御",
];

const ethics = [
  "本人同意なしの記憶抽出は禁止",
  "第三者の個人情報は自動匿名化",
  "トラウマ記憶は高リスク審査対象",
  "未成年期の記憶は制限付き",
  "犯罪・暴力・搾取に関わる記憶は厳格審査",
  "独占ライセンス契約では、提供者側の記憶アクセスに制限が発生する可能性がある",
  "購入者には、体験後の現実復帰ガイダンスを提供する",
];

const reviews: Review[] = [
  {
    quote: "放課後の教室で告白した記憶を買いました。現実の高校時代は何もなかったのに、駅のホームで夕方の匂いがすると、ちゃんと好きだった人がいた気がします。",
    memory: "放課後、誰にも言えなかった告白",
    effect: "青春恋愛 / 郷愁",
    participant: "32歳・会社員",
  },
  {
    quote: "結婚しなかった人生を選んだことに後悔はないと思っていました。でも、結婚式の朝の記憶を体験したら、後悔というより、別の私にも幸せがあったんだと納得できました。",
    memory: "結婚した世界線の10年間",
    effect: "人生分岐 / 安堵",
    participant: "44歳・経営者",
  },
  {
    quote: "旅行に行く時間がないまま40代になりました。ヨーロッパを一人で回った9日間の記憶を買ってから、仕事帰りに知らない路地へ入るのが少し怖くなくなりました。",
    memory: "学生最後のヨーロッパ周遊",
    effect: "旅行 / 解放感",
    participant: "41歳・医師",
  },
  {
    quote: "CEO体験を購入してから、会議室の景色が少し違って見えるようになりました。成功した自分を信じるというより、大きな決断の前に黙る時間を覚えた感じです。",
    memory: "Executive Success",
    effect: "成功 / 判断",
    participant: "38歳・事業責任者",
  },
  {
    quote: "県大会で負けた帰りのバスを体験しました。私は挫折らしい挫折を避けてきたので、悔しくて黙っている十代の自分が、妙に大人に見えました。",
    memory: "県大会で負けた帰りのバス",
    effect: "敗北 / 奥行き",
    participant: "29歳・コンサルタント",
  },
  {
    quote: "別の性別で成人式を迎える記憶は、思っていたより派手ではありませんでした。髪を整え、名前を呼ばれ、家族に写真を撮られる。それだけなのに、世界の見え方が半歩ずれました。",
    memory: "別の性別で迎える成人式",
    effect: "アイデンティティ / 視点変化",
    participant: "35歳・デザイナー",
  },
  {
    quote: "独身のまま海外赴任した5年間を入れました。家族を選んだ今の人生を否定するためではなく、選ばなかった静けさにも触れたかった。体験後、今の家の騒がしさが前より愛おしいです。",
    memory: "独身で仕事に振り切った5年間",
    effect: "人生分岐 / 再肯定",
    participant: "47歳・教師",
  },
  {
    quote: "初個展で一枚だけ作品が売れる記憶を買いました。大成功ではなく、一人だけが本気で見てくれたという小ささがよかった。帰ってから、しまっていた画材を出しました。",
    memory: "美術室で褒められた一枚",
    effect: "才能 / 再開",
    participant: "26歳・販売員",
  },
  {
    quote: "失恋版を選んだのに、体験後に残ったのは惨めさではありませんでした。選ばれなかった自分にも、あの夕方を最後まで歩いた尊さがあると思えました。",
    memory: "卒業前日に返事をもらう",
    effect: "失恋 / 自己受容",
    participant: "52歳・公務員",
  },
];

const faqs: Faq[] = [
  {
    question: "これは夢ですか？",
    answer: "夢ではありません。Novamnesis Laboratories は体験後に残る記憶印象を設計する架空のサービスです。目覚めたあとも、記憶は静かに日常へ重なります。",
  },
  {
    question: "記憶は消せますか？",
    answer: "体験直後の軽減処理は可能です。ただし、強い感情を伴う記憶は完全な無痕化を保証していません。",
  },
  {
    question: "本当に安全ですか？",
    answer: "体験前後に複数の安全プロトコルを設けています。高リスク記憶は段階的に再生され、必要に応じて中断されます。",
  },
  {
    question: "現実と混同しませんか？",
    answer: "境界維持タグを付与し、現実復帰ガイダンスを提供します。それでも、良い記憶ほど現実に似てしまうことがあります。",
  },
  {
    question: "購入した記憶と現実の記憶を入れ替えることはできますか？",
    answer:
      "完全な入れ替えではなく、購入した記憶を現実の記憶の近くに重ねる形で調整できます。たとえば、行けなかった旅行や選ばなかった人生を、強い実感を伴う記憶として残すことはできますが、現実に起きた出来事を消去したり、事実として置き換えたりする設計ではありません。体験後も『これは購入した記憶である』と認識できる境界タグが付与されます。",
  },
  {
    question: "体験後に副作用はありますか？",
    answer: "一時的な既視感、感情の残響、選ばなかった人生への郷愁が報告されています。多くは短期間で落ち着きます。",
  },
  {
    question: "自分の記憶を売ると、その記憶は失われますか？",
    answer: "通常売却では失われません。独占ライセンスでは、契約範囲に応じて一部アクセス制限が発生する場合があります。",
  },
  {
    question: "売却した記憶に他人がアクセスするのですか？",
    answer: "他人が体験するのは匿名化・編集・再構成された記憶商品です。あなた自身の生の記憶がそのまま流通することはありません。",
  },
  {
    question: "第三者が登場する記憶はどう処理されますか？",
    answer: "顔、声、氏名、関係性、識別可能な生活情報を自動匿名化し、必要に応じて人物構造を置換します。",
  },
  {
    question: "トラウマ記憶も販売できますか？",
    answer: "申請は可能ですが、高リスク審査の対象です。販売よりも保全、封印、非公開アーカイブを推奨する場合があります。",
  },
  {
    question: "独占ライセンスとは何ですか？",
    answer: "特定の購入者や企業が、一定期間その記憶商品の利用権を独占する契約です。提供者にも静かな制約が残ることがあります。",
  },
];

function notify(message: string) {
  window.alert(`${message}\n\nNovamnesis Laboratories は架空のデモサイトです。`);
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-8 text-slate-300">{description}</p>}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  tone = "dark",
  href,
}: {
  children: string;
  variant?: "primary" | "secondary";
  tone?: Tone;
  href?: string;
}) {
  const classes =
    tone === "corporate"
      ? variant === "primary"
        ? "border border-cyanline/30 bg-cyanline text-obsidian shadow-[0_0_24px_rgba(88,244,255,0.16)] hover:-translate-y-0.5 hover:bg-white"
        : "border border-white/15 bg-white/[0.03] text-slate-100 hover:border-cyanline/45 hover:bg-white/[0.07]"
      : tone === "light"
        ? variant === "primary"
          ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800"
          : "border border-slate-300 bg-white text-slate-800 hover:border-slate-500 hover:bg-slate-50"
        : variant === "primary"
          ? "bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse text-obsidian shadow-glow hover:-translate-y-0.5"
          : "border border-white/15 bg-white/5 text-white hover:border-cyanline/60 hover:bg-white/10";

  const className = `rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 ${tone === "light" ? "focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white" : "focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
    } ${classes}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={() => notify(children)} type="button">
      {children}
    </button>
  );
}

function LogoMark({ tone = "dark", className = "h-10 w-10" }: { tone?: Tone; className?: string }) {
  const shell = tone === "light" ? "text-slate-950" : "text-cyanline";
  const core = tone === "light" ? "#0f172a" : "#58f4ff";
  const pulse = tone === "light" ? "#475569" : "#ff4fd8";

  return (
    <svg className={`${className} ${shell}`} viewBox="0 0 64 64" role="img" aria-label="Novamnesis Laboratories logo mark">
      <path
        d="M32 4 54 16.5v31L32 60 10 47.5v-31L32 4Z"
        fill="currentColor"
        fillOpacity={tone === "light" ? 0.08 : 0.1}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 44V20l24 24V20" fill="none" stroke={core} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <path d="M18 20c8-8 20-8 28 0M18 44c8 8 20 8 28 0" fill="none" stroke={pulse} strokeLinecap="round" strokeWidth="2" opacity="0.78" />
      <circle cx="20" cy="20" r="3.4" fill={pulse} />
      <circle cx="44" cy="44" r="3.4" fill={core} />
    </svg>
  );
}

function BrandLockup({ tone = "dark" }: { tone?: Tone }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark tone={tone} />
      <div>
        <div className={`text-base font-semibold tracking-[0.18em] sm:text-lg ${tone === "light" ? "text-slate-950" : "text-white"}`}>NOVAMNESIS</div>
        <div className={`text-[11px] transition ${tone === "light" ? "text-slate-500 group-hover:text-slate-800" : "text-slate-400 group-hover:text-cyanline"}`}>
          Laboratories / Memory Experience Marketplace
        </div>
      </div>
    </div>
  );
}

function Header({
  items,
  cta,
  tone = "dark",
  ctaHref,
}: {
  items: { label: string; href: string }[];
  cta?: string;
  tone?: Tone;
  ctaHref?: string;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl ${tone === "light" ? "border-slate-200 bg-white/90" : "border-white/10 bg-obsidian/80"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="group">
          <BrandLockup tone={tone} />
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition ${tone === "light" ? "text-slate-600 hover:text-slate-950" : "text-slate-300 hover:text-white"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        {cta && ctaHref ? (
          <a
            href={ctaHref}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 ${tone === "light"
              ? "bg-slate-950 text-white hover:-translate-y-0.5 focus:ring-offset-white"
              : "bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse text-obsidian shadow-glow hover:-translate-y-0.5 focus:ring-offset-obsidian"
              }`}
          >
            {cta}
          </a>
        ) : cta ? (
          <Button tone={tone}>{cta}</Button>
        ) : null}
      </nav>
    </header>
  );
}

function HeroVisual() {
  const bars = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] animate-float rounded-full border border-cyanline/20 bg-white/[0.03] p-6 shadow-glow">
      <div className="absolute inset-8 rounded-full border border-magentapulse/20" />
      <div className="absolute inset-16 rounded-full border border-violetsignal/20" />
      <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,244,255,0.28),rgba(157,109,255,0.08)_45%,transparent_70%)] blur-sm" />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="h-1/2 w-full animate-scan bg-gradient-to-b from-transparent via-cyanline/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {bars.map((bar) => (
          <span
            key={bar}
            className="h-20 w-1 rounded-full bg-gradient-to-t from-magentapulse via-cyanline to-violetsignal opacity-80"
            style={{
              height: `${48 + Math.sin(bar * 0.8) * 28 + (bar % 3) * 16}px`,
              animation: `pulse ${1.8 + (bar % 5) * 0.2}s ease-in-out infinite`,
              animationDelay: `${bar * 0.08}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-16 left-1/2 w-64 -translate-x-1/2 rounded-full border border-white/10 bg-obsidian/70 px-5 py-3 text-center text-xs text-cyanline backdrop-blur-md">
        MEMORY STREAM 08.17 / CONSENT VERIFIED
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(88,244,255,0.15),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_65%,#060711_100%)]" />
      <div className="absolute inset-0 -z-10 novamnesis-grid opacity-40" />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 pb-24 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="animate-fadeIn">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
            <LogoMark tone="dark" className="h-8 w-8" />
            <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Novamnesis Laboratories</span>
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyanline">Novamnesis Laboratories — Memory Experience Marketplace</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">経験したかった人生を、記憶として購入する。</h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300">
            Novamnesis Laboratories は、恋愛、成功、旅行、結婚、挫折、性別を入れ替えた人生まで、経験できなかった過去を記憶として購入できるマーケットプレイスです。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/experience">記憶を体験する</Button>
            <a
              href="/catalog"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              人生メニューを見る
            </a>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <p className="glass-panel">青春の恋も、行けなかった旅も、選ばなかった結婚も。</p>
            <p className="glass-panel">幸せな記憶も、挫折の記憶も、人生の厚みとして手に入れる。</p>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function CatalogHero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(255,79,216,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(88,244,255,0.18),transparent_32%),linear-gradient(180deg,#060711_0%,#0c1020_70%,#060711_100%)]" />
      <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyanline">Novamnesis Catalog</p>
        <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
          買いたくなる過去を、記憶メニューから選ぶ。
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-slate-300">
          一生分の人生テンプレートだけではなく、放課後の恋、部活の挫折、甲子園の熱、幼稚園の帰り道まで。Novamnesis Catalog は、短い過去の断片も購入可能な記憶体験です。
        </p>
      </div>
    </section>
  );
}

function Problem() {
  const points = [
    "毎日同じ通勤、同じ仕事、同じ夜。",
    "本当に欲しかった人生は、まだ体験できていない。",
    "あなたがすでに体験した人生の一部は、誰かにとって強く望まれる記憶かもしれない。",
    "記憶は、消えていくものではなく、保存され、編集され、流通する資産になりつつある。",
  ];

  return (
    <section className="section">
      <SectionHeader eyebrow="Unlived Life" title="あなたの人生は、本当にこれだけですか？" />
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        {points.map((point) => (
          <div key={point} className="glass-card text-lg leading-8 text-slate-200">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}

function PurchaseUseCases() {
  return (
    <section id="use-cases" className="section">
      <SectionHeader
        eyebrow="Purchase Motives"
        title="買う理由は、後悔だけではない。"
        description="Novamnesis Laboratories は「なかったことを埋める」だけのサービスではありません。恋愛、成功、旅行、結婚、性別、挫折。人生の手触りを増やすために、欲しい記憶を選べます。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {purchaseUseCases.map((item) => (
          <article key={item.title} className="plan-card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="rounded-full border border-cyanline/25 bg-cyanline/10 px-3 py-1 text-xs font-semibold text-cyanline">
                {item.label}
              </span>
              <span className="text-xs text-slate-500">{item.startingPrice}</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-magentapulse">{item.desire}</p>
            <h3 className="mt-4 text-2xl font-semibold leading-8 text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            <div className="mt-6 grid gap-2">
              {item.examples.map((example) => (
                <p key={example} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm leading-6 text-slate-300">
                  {example}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-6 text-center backdrop-blur-xl">
        <p className="text-base leading-8 text-slate-200">
          幸せな記憶を足すことも、失敗の記憶を足すことも、どちらも人生を豊かにする選択です。Novamnesis Laboratories では購入前に感情強度と境界タグを調整し、現実の自分を保ったまま「経験したかった人生」を持ち帰れるように設計します。
        </p>
      </div>
    </section>
  );
}

function Service() {
  const items = [
    "人工記憶や編集済みの実体験記憶によって、特別な人生を記憶として体験できます。",
    "体験は数十分でも、記憶上は数日・数週間の冒険として残ります。",
    "感情強度、物語性、感覚情報、倫理審査レベルに基づいて調整されます。",
    "体験前にカウンセリングと記憶整合性チェックを行います。",
    "体験後には現実復帰のための認知安定プロトコルを行います。",
  ];

  return (
    <section id="experience" className="section">
      <SectionHeader
        eyebrow="Experience Layer"
        title="現実ではなく、記憶として体験する。"
        description="Novamnesis Laboratories の体験は、あなたの現在を変えずに、あなたの過去の輪郭だけを増やします。"
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-magenta backdrop-blur-xl md:p-10">
        <div className="grid gap-4 md:grid-cols-5">
          {items.map((item, index) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-obsidian/60 p-5">
              <span className="text-xs text-cyanline">0{index + 1}</span>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacilityTeaser() {
  return (
    <section className="section pt-4">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_50%_18%,rgba(88,244,255,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-glow">
          <div className="absolute inset-0 novamnesis-grid opacity-25" />
          <div className="absolute left-1/2 top-8 h-20 w-48 -translate-x-1/2 rounded-full border border-cyanline/30 bg-cyanline/10 blur-sm" />
          <div className="absolute left-1/2 top-20 h-24 w-24 -translate-x-1/2 rounded-full border border-white/15 bg-obsidian/80 shadow-[0_0_28px_rgba(88,244,255,0.22)]" />
          <div className="absolute left-1/2 top-28 h-28 w-40 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-white/[0.04]" />
          <div className="absolute bottom-8 left-1/2 h-36 w-72 -translate-x-1/2 rounded-[2rem] border border-cyanline/20 bg-obsidian/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
          <div className="absolute bottom-20 left-1/2 h-20 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,244,255,0.20),transparent_68%)]" />
          <div className="absolute left-8 top-12 rounded-2xl border border-white/10 bg-obsidian/70 px-4 py-3 text-xs text-slate-300 backdrop-blur-md">
            CONSENT VERIFIED
          </div>
          <div className="absolute bottom-10 right-8 rounded-2xl border border-magentapulse/20 bg-obsidian/70 px-4 py-3 text-xs text-magentapulse backdrop-blur-md">
            DREAM DEPTH 42%
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Facility Preview</p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">どこに座って、何を付けられ、どんな状態になるのか。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            記憶体験が不安に見える理由は、仕組みよりも場面が見えないことにあります。Novamnesis の施設ページでは、来館から覚醒後のケアまでを、身体感覚が想像できる粒度で案内します。
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="/facility"
              className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
            >
              施設と体験の流れを見る
            </a>
            <a
              href="/safety"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              安全基準を見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marketplace() {
  return (
    <section id="marketplace" className="section">
      <SectionHeader
        eyebrow="Memory Marketplace"
        title="人生は、共有できる資産になる。"
        description="記憶はそのまま販売されません。個人情報や第三者情報を除去し、没入度・感情強度・現実混同リスクを評価したうえで、体験商品として再構成されます。"
      />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        {[
          ["Buy", "他人の人生の一部や、編集済みの冒険・成功・恋愛・旅・極限体験を記憶として体験できます。"],
          ["Sell", "提供者は、自分の記憶を記憶資産として登録し、査定結果に応じてライセンスできます。"],
          ["Rate", "すべての記憶には、没入度・感情強度・現実混同リスクのレーティングが付与されます。"],
        ].map(([title, text]) => (
          <div key={title} className="glass-card">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-magentapulse">{title}</p>
            <p className="mt-5 text-base leading-8 text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CatalogTeaser() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Catalog Preview"
        title="欲しかった人生は、メニューにある。"
        description="このLPでは、まず記憶体験の世界観を紹介します。具体的なスポーツ選手、アーティスト、ヒーロー、異世界転生などの購入メニューは、専用カタログで選べます。"
      />
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-cyanline/20 bg-white/[0.04] p-8 text-center shadow-glow backdrop-blur-xl">
        <p className="text-lg leading-8 text-slate-200">
          他人の記憶を覗くのではなく、あなたの中に「体験済みの過去」として残す。Novamnesis Catalog では、そのための人生テンプレートを購買導線として整理しています。
        </p>
        <div className="mt-8">
          <a
            href="/catalog"
            className="inline-flex rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
          >
            人生メニューを見る
          </a>
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="templates" className="section">
      <SectionHeader
        eyebrow="Catalog"
        title="あったかもしれない人生を選ぶ。"
        description="スポーツ選手、アーティスト、仮想ヒーロー、異世界転生。まず体験したい人生の型を選び、そこから具体的な記憶商品へ進めます。"
      />
      <div className="mx-auto mb-14 max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-magentapulse">Life Templates</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">長編テンプレート</h3>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experienceMenus.map((menu, index) => (
            <article key={menu.title} className="glass-card hover:-translate-y-1 hover:border-cyanline/30 hover:shadow-glow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyanline/25 bg-cyanline/10 text-sm font-semibold text-cyanline">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-semibold text-white">{menu.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{menu.description}</p>
              <a className="mt-6 inline-flex text-sm font-semibold text-cyanline transition hover:text-white" href={`/template/${menu.slug}`}>
                テンプレートを見る
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoryEpisodes() {
  return (
    <section id="episodes" className="section">
      <SectionHeader
        eyebrow="Short Memories"
        title="一生ではなく、あの数時間を買う。"
        description="青春、部活、恋愛、幼少期、敗北、達成。Novamnesis Laboratories では、一生分ではない短い記憶エピソードも選べます。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {memoryEpisodes.map((episode) => (
          <article key={episode.title} className="plan-card">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-magentapulse">{episode.tag}</p>
            <h3 className="text-lg font-semibold leading-7 text-white">{episode.title}</h3>
            <p className="mt-4 min-h-24 text-sm leading-7 text-slate-300">{episode.description}</p>
            <dl className="mt-6 grid gap-3 text-sm">
              <Info label="スパン" value={episode.period} />
              <Info label="感情" value={episode.intensity} />
              <Info label="由来" value={episode.source} />
            </dl>
            <div className="mt-7">
              <a
                href={`/episode/${episode.slug}`}
                className="inline-flex text-sm font-semibold text-cyanline transition hover:text-white"
              >
                体験内容を確認する
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white/[0.04] p-3 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}

function SellMemory() {
  return (
    <section id="sell" className="section">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Sell Your Memory</p>
          <h2 className="text-4xl font-semibold leading-tight text-white">あなたの記憶には、まだ価値がある。</h2>
          <p className="mt-6 text-base leading-8 text-slate-300">
            初恋、成功、挫折、旅、勝負の瞬間。あなたにとっては過去でも、誰かにとっては体験したかった人生かもしれません。
            Novamnesis Laboratories は、あなたの記憶を匿名化し、感情強度・希少性・没入度を評価したうえで、記憶体験として再構成します。
          </p>
          <p className="mt-5 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
            通常売却では、あなた自身の記憶は失われません。ただし、独占ライセンス契約では、一部の記憶アクセスに制限が発生する場合があります。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>記憶を査定する</Button>
            <Button variant="secondary">売却プロセスを見る</Button>
          </div>
        </div>
        <div className="glass-card">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm text-slate-400">VALUATION PREVIEW</span>
            <span className="text-cyanline">JPY 428,000 - 910,000</span>
          </div>
          {valuation.slice(0, 4).map((item, index) => (
            <div key={item.title} className="mb-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{item.title}</span>
                <span className="text-slate-500">{72 + index * 6}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyanline to-magentapulse" style={{ width: `${72 + index * 6}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardGrid({ eyebrow, title, items }: { eyebrow: string; title: string; items: SimpleCard[] }) {
  return (
    <section className="section">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="glass-card">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section">
      <SectionHeader eyebrow="Process" title="記憶を売る流れ。" />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sellSteps.map((step, index) => (
          <div key={step} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <span className="text-xs text-cyanline">STEP {String(index + 1).padStart(2, "0")}</span>
            <p className="mt-4 font-medium text-white">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Safety() {
  return (
    <section id="safety" className="section">
      <SectionHeader
        eyebrow="Safety"
        title="安全とは、忘れないための設計です。"
        description="Novamnesis Laboratories は体験前、体験中、体験後の各段階で、現実と記憶の境界を保つための架空プロトコルを実行します。"
      />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="glass-card">
          <h3 className="text-xl font-semibold text-white">Safety Controls</h3>
          <div className="mt-6 grid gap-3">
            {safetyItems.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div id="ethics" className="glass-card">
          <h3 className="text-xl font-semibold text-white">Ethical Protocol</h3>
          <div className="mt-6 space-y-3">
            {ethics.map((item) => (
              <p key={item} className="border-l border-cyanline/40 pl-4 text-sm leading-7 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Testimonials"
        title="体験後に残った言葉。"
        description="購入者が持ち帰ったのは、派手な夢ではなく、日常の見え方を少し変える記憶でした。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <figure key={`${review.memory}-${review.participant}`} className="glass-card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="rounded-full border border-magentapulse/25 bg-magentapulse/10 px-3 py-1 text-xs font-semibold text-magentapulse">
                {review.effect}
              </span>
              <span className="text-xs text-slate-500">#{2031 + index}</span>
            </div>
            <blockquote className="text-base leading-8 text-slate-200">“{review.quote}”</blockquote>
            <figcaption className="mt-6 text-sm text-slate-500">
              <span className="block text-slate-300">{review.memory}</span>
              <span className="mt-1 block">{review.participant}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="section">
      <SectionHeader eyebrow="FAQ" title="よくある質問。" />
      <div className="mx-auto grid max-w-5xl gap-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <summary className="cursor-pointer list-none text-lg font-medium text-white">
              <span className="inline-flex w-full items-center justify-between gap-4">
                {faq.question}
                <span className="text-cyanline transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_15%_20%,rgba(88,244,255,0.18),transparent_28%),radial-gradient(circle_at_85%_40%,rgba(255,79,216,0.16),transparent_30%),rgba(255,255,255,0.04)] p-8 text-center shadow-glow md:p-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Begin Again</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white">あなたが本当に欲しかった人生を、記憶から始めよう。</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
          体験するか、提供するか。Novamnesis Laboratories は、あなたの過去と未来に新しい選択肢を与えます。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/experience">記憶を体験する</Button>
          <Button href="/sell" variant="secondary">記憶を査定する</Button>
        </div>
      </div>
    </section>
  );
}

function CompanyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={companyNavItems} tone="corporate" />
      <section id="overview" className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.24),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.18),transparent_28%),radial-gradient(circle_at_55%_84%,rgba(157,109,255,0.12),transparent_32%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="absolute inset-x-0 top-28 -z-10 h-px bg-gradient-to-r from-transparent via-cyanline/50 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="corporate" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Corporate Protocol</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">LIFE MEMORY LABORATORY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              経験したかった人生を、記憶として購入する。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              Novamnesis Laboratories は、経験できなかった恋愛、選ばなかった人生、行けなかった旅、味わえなかった成功や挫折を、記憶体験として設計する架空の研究企業です。人生をやり直すのではなく、あなたの中にもうひとつの過去を増やします。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["CONSENT", "100%"],
                ["ANONYMIZE", "L4"],
                ["BOUNDARY TAG", "ACTIVE"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-cyanline">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cyanline/20 bg-white/[0.045] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyanline">Audit Terminal</p>
              <span className="rounded-full border border-cyanline/25 bg-cyanline/10 px-3 py-1 text-xs font-semibold text-cyanline">LIVE</span>
            </div>
            <div className="grid gap-3">
              {[
                ["MEMORY SOURCE", "CONSENT VERIFIED"],
                ["THIRD PARTY DATA", "REMOVED"],
                ["REALITY DRIFT", "0.08"],
                ["ETHICS REVIEW", "PASSED"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-white/10 bg-obsidian/65 px-4 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-200">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-magentapulse">Operating Principles</p>
            <div className="mt-4 grid gap-3">
              {["本人同意に基づく記憶登録", "匿名化と第三者情報の除去", "境界タグによる現実復帰支援", "高リスク記憶の段階的審査"].map((item) => (
                <div key={item} className="rounded-xl border border-cyanline/10 bg-cyanline/[0.04] px-4 py-3 text-sm font-medium text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_20%,rgba(88,244,255,0.08),transparent_24%),radial-gradient(circle_at_92%_30%,rgba(255,79,216,0.08),transparent_26%)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">For Buyers</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶を買う前に、会社が保証すること。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Novamnesis Laboratories の主役は、記憶を購入する体験者です。欲しかった人生を選ぶ前に、内容の調整、境界タグ、安全確認、体験後ケアを会社として明確にします。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            ["Curated Catalog", "恋愛、成功、旅行、人生分岐、物語記憶を、購入前に内容・強度・余韻で比較できます。"],
            ["Boundary Design", "購入した記憶が現実の経歴と混ざりすぎないよう、体験前に境界タグを設計します。"],
            ["Aftercare", "体験後は日付、現在地、購入記憶であることを確認し、必要に応じて認知安定セッションを行います。"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Purchase Categories</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">購入できる記憶カテゴリ。</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer items={companyNavItems} />
    </main>
  );
}

function SafetyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={companyNavItems} tone="corporate" />
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="corporate" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Safety Protocol</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">MEMORY EXPERIENCE SAFETY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              記憶を買う前に、安全基準を確認する。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              Novamnesis Laboratories は、購入した記憶が日常へ戻る力を壊さないよう、体験前、体験中、体験後の各段階で境界タグ、感情強度、現実混同リスクを管理します。
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cyanline/20 bg-white/[0.045] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Pre-Session Gate</p>
            <div className="grid gap-3">
              {[
                ["Consent", "必須"],
                ["Boundary Tag", "自動付与"],
                ["Reality Drift", "事前評価"],
                ["Aftercare", "全体験に付属"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-white/10 bg-obsidian/65 px-4 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_18%,rgba(88,244,255,0.08),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(255,79,216,0.08),transparent_30%)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Safety Controls</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">体験前後の安全管理。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            安全基準は購入前の判断材料です。どの記憶を選ぶ場合でも、体験内容より先に確認できる独立ページとして公開しています。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {safetyItems.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-sm leading-7 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ethics" className="relative overflow-hidden px-5 py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Ethical Protocol</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">倫理プロトコル。</h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {ethics.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300 backdrop-blur-xl">
              {item}
            </p>
          ))}
        </div>
      </section>

      <Footer items={companyNavItems} />
    </main>
  );
}

function SellPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={sellNavItems} cta="記憶を体験する" ctaHref="/experience" tone="corporate" />
      <section id="overview" className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(255,79,216,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(88,244,255,0.20),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-30" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-magentapulse/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="corporate" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Memory Provider</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">SELL YOUR MEMORY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              あなたの記憶を、誰かの体験したかった人生へ。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              売却ページでは、提供者向けに記憶の査定、匿名化、ライセンス、掲載までの流れを案内します。購入者向けの会社情報とは分けて、記憶を提供する人が確認すべき条件だけを整理しています。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="#valuation" tone="corporate">査定基準を見る</Button>
              <Button href="#process" tone="corporate" variant="secondary">売却プロセスを見る</Button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-cyanline/15 bg-white/[0.045] p-6 shadow-[0_0_34px_rgba(88,244,255,0.12),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm text-slate-400">VALUATION PREVIEW</span>
              <span className="font-semibold text-cyanline">JPY 428,000 - 910,000</span>
            </div>
            {valuation.slice(0, 4).map((item, index) => (
              <div key={item.title} className="mb-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{item.title}</span>
                  <span className="text-slate-500">{72 + index * 6}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyanline to-magentapulse" style={{ width: `${72 + index * 6}%` }} />
                </div>
              </div>
            ))}
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              通常売却では、提供者自身の記憶は失われません。独占ライセンス契約では、契約範囲に応じて一部アクセス制限が発生する場合があります。
            </p>
          </div>
        </div>
      </section>

      <section id="valuation" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Memory Valuation</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶資産の査定基準。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            初恋、成功、挫折、旅、勝負の瞬間。Novamnesis Laboratories は、提供者の同意に基づいて記憶を匿名化し、感情強度・希少性・没入度・安全性を評価します。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {valuation.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.05),transparent)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Process</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶を売る流れ。</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sellSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="text-xs font-semibold text-cyanline">STEP {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 font-medium leading-7 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer items={sellNavItems} />
    </main>
  );
}

function FacilityPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={facilityNavItems} cta="記憶メニューを見る" ctaHref="/catalog" />
      <section id="room" className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.15),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_70%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Facility Protocol</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">MEMORY FIXATION ROOM</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">記憶定着の流れを、事前に確認できます。</h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              体験者が最初に知りたいのは、技術の名前よりも、自分がどこに座り、何を頭に付けられ、どんな感覚の中で記憶が入ってくるのかです。Novamnesis の施設は、その不安を減らすために公開されています。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["SESSION", "60 MIN"],
                ["STAFF", "2名常駐"],
                ["STOP", "音声中断可"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-cyanline">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.04] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-0 novamnesis-grid opacity-20" />
            <div className="absolute left-1/2 top-8 h-28 w-72 -translate-x-1/2 rounded-full border border-cyanline/20 bg-cyanline/10 blur-sm" />
            <div className="absolute left-1/2 top-20 h-28 w-28 -translate-x-1/2 rounded-full border border-white/15 bg-obsidian/85 shadow-[0_0_32px_rgba(88,244,255,0.25)]" />
            <div className="absolute left-1/2 top-28 h-5 w-48 -translate-x-1/2 rounded-full border border-cyanline/25 bg-cyanline/10" />
            <div className="absolute left-1/2 top-40 h-40 w-52 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
            <div className="absolute bottom-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-[2rem] border border-cyanline/20 bg-obsidian/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute bottom-28 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,244,255,0.24),transparent_66%)]" />
            <div className="absolute left-7 top-8 rounded-2xl border border-white/10 bg-obsidian/75 px-4 py-3 text-xs leading-6 text-slate-300 backdrop-blur-md">
              <span className="block text-cyanline">NEURO CROWN</span>
              contact pressure: soft
            </div>
            <div className="absolute bottom-8 right-7 rounded-2xl border border-magentapulse/20 bg-obsidian/75 px-4 py-3 text-xs leading-6 text-slate-300 backdrop-blur-md">
              <span className="block text-magentapulse">RETURN BAY</span>
              boundary tag active
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Room Tour"
          title="安心して体験に入れる、静かな空間です。"
          description="施設の安心感は、説明の丁寧さだけでなく、入った瞬間に身体がどう反応するかで決まります。体験前後の部屋を分け、記憶と現実が急に混ざらない動線にしています。"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {roomZones.map((zone) => (
            <div key={zone.title} className="glass-card">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-magentapulse">{zone.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{zone.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="session" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.06),transparent)]" />
        <SectionHeader
          eyebrow="Session Flow"
          title="来館からお帰りまでの流れをご案内します。"
          description="体験者は眠らされるのではなく、浅い睡眠に近い状態へ誘導されます。スタッフ、機械、本人の停止合図が同時にセッションを見守ります。"
        />
        <div className="mx-auto max-w-5xl">
          {sessionSteps.map((step, index) => (
            <div key={step.title} className="grid gap-4 border-t border-white/10 py-6 md:grid-cols-[120px_1fr]">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">STEP {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm text-slate-500">{step.time}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">During Fixation</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">記憶定着は、リラックスした状態で行われます。</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              目を閉じ、呼吸はゆっくりになり、時々指先や表情だけが反応します。中では記憶が再生されているのではなく、感情と感覚の順番が本人の中に結び直されています。
            </p>
          </div>
          <div className="grid gap-4">
            <figure className="overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.04] shadow-glow backdrop-blur-xl">
              <img
                src="/images/memory-fixation-session.png"
                alt="未来的なリクライニングチェアでリラックスしながら記憶定着を受けている様子"
                className="aspect-[16/10] w-full object-cover"
              />
              <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-slate-300">
                高級マッサージチェアに近い姿勢で、柔らかいニューロクラウンを装着します。身体を拘束せず、スタッフが離れた端末から状態を見守ります。
              </figcaption>
            </figure>
            {bodyStates.map((state) => (
              <p key={state} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-300 backdrop-blur-xl">
                {state}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="aftercare" className="section pt-0">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_18%_20%,rgba(88,244,255,0.16),transparent_28%),radial-gradient(circle_at_86%_46%,rgba(255,79,216,0.12),transparent_30%),rgba(255,255,255,0.04)] p-8 shadow-glow md:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Aftercare</p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">体験後は、ゆっくり日常へ戻ります。</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            体験後は、購入した記憶を否定せず、現実の履歴とも混ぜすぎない時間を置きます。水を飲む、日付を見る、短い会話をする。その小さな手順が、記憶を安心して持ち帰るための最後の設備です。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/catalog"
              className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
            >
              記憶メニューを見る
            </a>
            <a
              href="/#faq"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              よくある質問へ
            </a>
          </div>
        </div>
      </section>
      <Footer items={facilityNavItems} />
    </main>
  );
}

function ExperienceStartPage() {
  const [selectedMemoryType, setSelectedMemoryType] = useState(experienceEntryOptions[0].title);
  const bookingHref = `/booking?memoryType=${encodeURIComponent(selectedMemoryType)}`;

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} cta="施設を確認する" ctaHref="/facility" />
      <section className="relative overflow-hidden px-5 pb-16 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Memory Intake</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">START EXPERIENCE</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              体験したい記憶を、ここから選びます。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              初回は、記憶の種類と感情の強さを確認しながら進めます。いきなり定着に入るのではなく、体験したい過去、避けたい場面、終了後に残したい余韻を一つずつ整理します。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#intake"
                className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
              >
                体験前チェックを始める
              </a>
              <a
                href="/facility"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
              >
                施設を先に見る
              </a>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">First Session</p>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="初回確認" value="約30分" />
              <Info label="体験時間" value="記憶タイプで変動" />
              <Info label="定着強度" value="Low から開始" />
              <Info label="中断" value="いつでも可能" />
            </dl>
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              このページは体験の入口です。購入や予約を確定する前に、記憶の内容と安全確認を整理できます。
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <SectionHeader
          eyebrow="Choose Memory"
          title="まずは、体験したい記憶のタイプを選びます。"
          description="ここでは大まかな記憶タイプだけを選びます。短い場面の記憶は1回の体験で扱えますが、数年分の人生記憶は複数回のセッションに分けて定着させます。"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {experienceEntryOptions.map((option) => (
            <button
              key={option.title}
              type="button"
              onClick={() => setSelectedMemoryType(option.title)}
              className={`plan-card text-left ${selectedMemoryType === option.title ? "border-cyanline/70 bg-cyanline/10 shadow-glow" : ""
                }`}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-magentapulse">{option.meta}</p>
              <h3 className="text-xl font-semibold text-white">{option.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{option.description}</p>
              <dl className="mt-5 grid gap-2 text-sm">
                <Info label="体験時間" value={option.sessionSpan} />
                <Info label="記憶内の期間" value={option.memorySpan} />
              </dl>
              <p className={`mt-5 text-xs font-semibold ${selectedMemoryType === option.title ? "text-cyanline" : "text-slate-500"}`}>
                {selectedMemoryType === option.title ? "選択中" : "クリックして選択"}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="intake" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.06),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Intake Check</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">体験前に確認すること。</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              記憶定着は、希望を聞いてすぐ始めるものではありません。心地よく持ち帰れる記憶にするため、以下の項目を確認します。
            </p>
            <div className="mt-7 grid gap-5 border-l border-cyanline/30 pl-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">01</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">まず、体験したい記憶の方向性を確認します。ここで選ぶのは大枠です。具体的な記憶メニューは予約後の説明で調整できます。</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">02</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">次に、残したい余韻や避けたい感情を確認します。不安な場面がある場合は、右側のフォームで複数選択できます。</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">03</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">最後に、予約ページで日時と来館前説明の方法を選びます。長い人生記憶は、初回確認後に必要な回数を提案します。</p>
              </div>
            </div>
          </div>
          <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl md:p-8">
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                体験したい記憶
                <select
                  value={selectedMemoryType}
                  onChange={(event) => setSelectedMemoryType(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline"
                >
                  {experienceEntryOptions.map((option) => (
                    <option key={option.title}>{option.title}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                感情の強さ
                <select className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                  <option>弱めに始めたい</option>
                  <option>標準で体験したい</option>
                  <option>強めの余韻を残したい</option>
                </select>
              </label>
              <fieldset className="grid gap-3 rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-200">重点的に確認したいこと</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {intakeChecks.map((item) => (
                    <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal leading-6 text-slate-300">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-cyanline" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                避けたい場面
                <textarea
                  className="min-h-28 resize-none rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal leading-7 text-slate-200 outline-none focus:border-cyanline"
                  placeholder="例: 大きな音、強い喪失感、暗い場所"
                />
              </label>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button href={bookingHref}>体験内容を確認して予約へ進む</Button>
                <Button href="/catalog" variant="secondary">
                  メニューから選ぶ
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <FinalCta />
      <Footer items={landingNavItems} />
    </main>
  );
}

function getDefaultVisitDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

function BookingPage() {
  const requestedMemoryType = new URLSearchParams(window.location.search).get("memoryType");
  const initialMemoryType = experienceEntryOptions.some((option) => option.title === requestedMemoryType)
    ? requestedMemoryType ?? experienceEntryOptions[0].title
    : experienceEntryOptions[0].title;
  const [memoryType, setMemoryType] = useState(initialMemoryType);
  const [emotionLevel, setEmotionLevel] = useState("弱め");
  const [visitDate, setVisitDate] = useState(getDefaultVisitDate);
  const [visitTime, setVisitTime] = useState("10:00 初回確認");
  const [briefing, setBriefing] = useState("オンライン説明を受ける");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formattedVisitDate = visitDate
    ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date(`${visitDate}T00:00:00`))
    : "未選択";

  function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMemoryType(String(formData.get("memoryType") || memoryType));
    setEmotionLevel(String(formData.get("emotionLevel") || emotionLevel));
    setVisitDate(String(formData.get("visitDate") || visitDate));
    setVisitTime(String(formData.get("visitTime") || visitTime));
    setBriefing(String(formData.get("briefing") || briefing));
    setName(String(formData.get("name") || name));
    setEmail(String(formData.get("email") || email));
    setNotes(String(formData.get("notes") || notes));
    setIsSending(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 1800);
  }

  function showBookingConfirmation() {
    setIsSending(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} cta="施設を確認する" ctaHref="/facility" />
      <section className="relative overflow-hidden px-5 pb-16 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(88,244,255,0.18),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Booking</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">RESERVE SESSION</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              体験内容を確認して、日時を予約します。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              ここでは、体験したい記憶の種類、感情の強さ、希望日時、来館前説明の方法を確認します。長い人生記憶は1回で完了させず、スタッフによる事前確認後に必要なセッション回数を提案します。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {bookingSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-cyanline">STEP {String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {isSending ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-cyanline/25 bg-cyanline/5 p-6 shadow-glow backdrop-blur-xl md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Transmitting Request</p>
              <h2 className="text-3xl font-semibold leading-tight text-white">予約内容を送信しています。</h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                希望日時、記憶タイプ、来館前説明の内容を Novamnesis 予約プロトコルに登録しています。
              </p>
              <div className="mt-8 grid gap-4">
                {["予約内容の検証", "境界タグの仮登録", "来館前説明の割り当て"].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyanline/30 bg-cyanline/10 text-xs font-semibold text-cyanline">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200">{item}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-xs leading-6 text-slate-500">
                この送信中表示はデモ演出です。実際の外部送信やメール送信は行われません。
              </p>
            </div>
          ) : submitted ? (
            <div className="rounded-[2rem] border border-cyanline/25 bg-cyanline/5 p-6 shadow-glow backdrop-blur-xl md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Reservation Received</p>
              <h2 className="text-3xl font-semibold leading-tight text-white">予約内容を送信しました。</h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                {name || "お客様"}様、Novamnesis Laboratories へのご予約ありがとうございます。後日のご来館を心よりお待ちしております。
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                  <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">来館予定</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formattedVisitDate}</p>
                  <p className="mt-1 text-sm text-slate-400">{visitTime}</p>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <Info label="記憶タイプ" value={memoryType} wide />
                  <Info label="感情の強さ" value={emotionLevel} />
                  <Info label="来館前説明" value={briefing} />
                  <Info label="連絡先" value={email || "未入力"} wide />
                </dl>
                {notes && (
                  <div className="rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                    <p className="mb-2 font-semibold text-slate-200">事前メモ</p>
                    <p>{notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/catalog"
                  className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
                >
                  別のメニューを見る
                </a>
                <button
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
                  onClick={() => {
                    setSubmitted(false);
                    setIsSending(false);
                  }}
                  type="button"
                >
                  予約内容を修正する
                </button>
              </div>
              <p className="mt-7 text-xs leading-6 text-slate-500">
                この送信結果はデモ表示です。実際の予約受付、メール送信、医療行為、記憶操作サービスは行われません。
              </p>
            </div>
          ) : (
            <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl md:p-8" onSubmit={handleBookingSubmit}>
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    記憶タイプ
                    <select name="memoryType" value={memoryType} onChange={(event) => setMemoryType(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      {experienceEntryOptions.map((option) => (
                        <option key={option.title}>{option.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    感情の強さ
                    <select name="emotionLevel" value={emotionLevel} onChange={(event) => setEmotionLevel(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      <option>弱め</option>
                      <option>標準</option>
                      <option>強め</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    希望日
                    <input type="date" name="visitDate" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    希望時間
                    <select name="visitTime" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      <option>10:00 初回確認</option>
                      <option>13:00 初回確認</option>
                      <option>16:00 初回確認</option>
                      <option>19:00 初回確認</option>
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  来館前説明
                  <select name="briefing" value={briefing} onChange={(event) => setBriefing(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                    <option>オンライン説明を受ける</option>
                    <option>当日、施設で説明を受ける</option>
                    <option>施設見学を先に予約する</option>
                  </select>
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    お名前
                    <input name="name" value={name} onChange={(event) => setName(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" placeholder="例: 山田 花子" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    メールアドレス
                    <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" placeholder="example@novamnesis.test" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  事前に伝えておきたいこと
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-28 resize-none rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal leading-7 text-slate-200 outline-none focus:border-cyanline"
                    placeholder="避けたい記憶、苦手な感覚、当日不安なことなど"
                  />
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-4 w-4 accent-cyanline" />
                  <span>予約後にスタッフが内容を確認し、必要に応じて体験内容を調整することに同意します。</span>
                </label>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
                    disabled={isSending}
                    onClick={showBookingConfirmation}
                    type="button"
                  >
                    {isSending ? "送信中..." : "予約内容を送信する"}
                  </button>
                  <Button href="/experience" variant="secondary">
                    体験内容を見直す
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
      <section className="section pt-4">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-cyanline/20 bg-cyanline/5 p-6 md:p-8">
          <p className="text-sm leading-7 text-slate-300">
            この予約フォームはデモです。実際の医療行為や記憶操作サービスではありません。送信後は入力内容をもとにした予約確認表示へ切り替わります。
          </p>
        </div>
      </section>
      <Footer items={landingNavItems} />
    </main>
  );
}

function LandingPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} cta="カタログを見る" ctaHref="/catalog" />
      <Hero />
      <Problem />
      <PurchaseUseCases />
      <Service />
      <FacilityTeaser />
      <Marketplace />
      <CatalogTeaser />
      <Reviews />
      <FAQ />
      <FinalCta />
      <Footer items={landingNavItems} />
    </main>
  );
}

function CatalogPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} cta="会社情報を見る" ctaHref="/company" />
      <CatalogHero />
      <MemoryEpisodes />
      <Plans />
      <section id="categories">
        <CardGrid eyebrow="Purchase Categories" title="人生メニューのカテゴリ。" items={categories} />
      </section>
      <FinalCta />
      <Footer items={catalogNavItems} />
    </main>
  );
}

function TemplateDetailPage({ template }: { template: ExperienceTemplate }) {
  const relatedPlans = plans.filter((plan) => template.recommendedPlans.includes(plan.title) || template.recommendedPlans.includes(plan.category));

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} cta="この人生を予約する" />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(88,244,255,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,79,216,0.16),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-30" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <a href="/catalog#templates" className="mb-8 inline-flex text-sm font-semibold text-cyanline transition hover:text-white">
              Catalog に戻る
            </a>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-magentapulse">Template Detail</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">{template.title}</h1>
            <p className="mt-5 text-2xl leading-9 text-cyanline">{template.tagline}</p>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">{template.description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>この人生を予約する</Button>
              <Button variant="secondary">境界タグを確認する</Button>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Memory Spec</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="体験時間" value={template.duration} />
              <Info label="記憶内期間" value={template.memorySpan} />
              <Info label="リスク" value={template.risk} />
              <Info label="構成" value="連続人生テンプレート" />
            </dl>
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              体験後には、現実の経歴ではなく「記憶として経験した人生」として境界タグが付与されます。強い憧れを伴うテンプレートでは、数日間の余韻が残る場合があります。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Memory Chapters"
          title="このテンプレートに含まれる記憶章。"
          description="単なるハイライトではなく、成功する前の退屈、失敗、身体の違和感まで含めて再構成されます。"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
          {template.chapters.map((chapter, index) => (
            <div key={chapter} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <span className="text-xs text-cyanline">CHAPTER {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-7 text-slate-200">{chapter}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">残る感覚情報</h2>
            <div className="mt-6 grid gap-3">
              {template.sensations.map((sensation) => (
                <p key={sensation} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-slate-300">
                  {sensation}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">購入前プロトコル</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>1. 願望適合スキャンで、憧れと現実復帰耐性を確認します。</p>
              <p>2. 記憶内の役割、成功度、失敗度、恋愛要素、危険度を調整します。</p>
              <p>3. 境界タグを付与し、体験後に「これは購入した記憶である」と認識できる状態を保ちます。</p>
              <p>4. 高リスクテンプレートでは、体験直後に認知安定セッションを行います。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Recommended Plans" title="このテンプレートに近い記憶商品。" />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {relatedPlans.slice(0, 3).map((plan) => (
            <article key={plan.title} className="plan-card">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-magentapulse">{plan.category}</p>
              <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Info label="体験時間" value={plan.duration} />
                <Info label="記憶内期間" value={plan.memorySpan} />
              </dl>
            </article>
          ))}
        </div>
      </section>

      <FinalCta />
      <Footer items={catalogNavItems} />
    </main>
  );
}

function EpisodeDetailPage({ episode }: { episode: MemoryEpisode }) {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} cta="この思い出を予約する" />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,79,216,0.17),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(88,244,255,0.14),transparent_30%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-25" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <a href="/catalog#episodes" className="mb-8 inline-flex text-sm font-semibold text-cyanline transition hover:text-white">
              Short Memories に戻る
            </a>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-magentapulse">{episode.tag}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">{episode.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">{episode.synopsis}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>この思い出を予約する</Button>
              <Button variant="secondary">感情強度を調整する</Button>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Episode Spec</p>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="スパン" value={episode.period} />
              <Info label="感情" value={episode.intensity} />
              <Info label="由来" value={episode.source} />
              <Info label="形式" value="短編記憶エピソード" />
            </dl>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
              短編記憶は、一生分の経歴ではなく、数十分から数日だけの濃い場面を体験する商品です。購入後は「自分が本当に経験した過去」ではなく「購入した記憶」として認識できる境界タグが付与されます。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Story Timeline"
          title="体験中に流れるストーリー。"
          description="購入前に、どんな順番で記憶が展開されるかを確認できます。"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
          {episode.timeline.map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <span className="text-xs text-cyanline">SCENE {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          <div className="glass-card lg:col-span-2">
            <h2 className="text-2xl font-semibold text-white">体験内容の詳細</h2>
            <div className="mt-6 grid gap-4">
              {episode.details.map((detail) => (
                <p key={detail} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm leading-7 text-slate-300">
                  {detail}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">残る感覚</h2>
            <div className="mt-6 grid gap-3">
              {episode.sensations.map((sensation) => (
                <p key={sensation} className="border-l border-cyanline/40 pl-4 text-sm leading-7 text-slate-300">
                  {sensation}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-8 backdrop-blur-xl md:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-magentapulse">Before Purchase</p>
          <h2 className="text-3xl font-semibold text-white">購入前に確認すること。</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {episode.purchaseNotes.map((note) => (
              <p key={note} className="rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                {note}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>この思い出を予約する</Button>
            <a
              href="/catalog#episodes"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              他の短編記憶を見る
            </a>
          </div>
        </div>
      </section>

      <Footer items={catalogNavItems} />
    </main>
  );
}

function Footer({ items = landingNavItems, tone = "dark" }: { items?: { label: string; href: string }[]; tone?: Tone }) {
  return (
    <footer className={`border-t px-5 py-10 ${tone === "light" ? "border-slate-200 bg-white text-slate-700" : "border-white/10"}`}>
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1.4fr]">
        <div>
          <BrandLockup tone={tone} />
          <p className={`mt-4 text-sm ${tone === "light" ? "text-slate-500" : "text-slate-500"}`}>架空企業情報 / Demo Corporate Profile</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {items.map((item) => (
            <a key={item.href} href={item.href} className={`text-sm ${tone === "light" ? "text-slate-600 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>
              {item.label}
            </a>
          ))}
        </div>
        <div
          className={`rounded-2xl border p-4 text-sm leading-7 ${tone === "light" ? "border-slate-200 bg-slate-50 text-slate-600" : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
        >
          <p>本サイトは架空のデモサイトです。</p>
          <p>実在する医療・金融・記憶操作サービスではありません。</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const path = window.location.pathname;

  if (path.startsWith("/template/")) {
    const slug = decodeURIComponent(path.replace("/template/", ""));
    const template = experienceMenus.find((item) => item.slug === slug);
    return template ? <TemplateDetailPage template={template} /> : <CatalogPage />;
  }

  if (path.startsWith("/episode/")) {
    const slug = decodeURIComponent(path.replace("/episode/", ""));
    const episode = memoryEpisodes.find((item) => item.slug === slug);
    return episode ? <EpisodeDetailPage episode={episode} /> : <CatalogPage />;
  }

  if (path === "/catalog") {
    return <CatalogPage />;
  }

  if (path === "/" || path === "/company") {
    return <CompanyPage />;
  }

  if (path === "/sell") {
    return <SellPage />;
  }

  if (path === "/safety") {
    return <SafetyPage />;
  }

  if (path === "/facility") {
    return <FacilityPage />;
  }

  if (path === "/experience") {
    return <ExperienceStartPage />;
  }

  if (path === "/booking") {
    return <BookingPage />;
  }

  return <CompanyPage />;
}
