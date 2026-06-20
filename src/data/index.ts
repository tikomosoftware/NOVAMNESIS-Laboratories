import { Plan, ExperienceTemplate, MemoryEpisode, PurchaseUseCase, Review, SimpleCard, Faq } from "../types";

export const primaryNavItems = [
  { label: "Catalog", href: "/catalog" },
  { label: "Experience", href: "/experience" },
  { label: "Booking", href: "/booking" },
  { label: "Safety", href: "/safety" },
  { label: "Sell Memory", href: "/sell" },
];

export const supportNavItems = [
  { label: "Facility", href: "/facility" },
  { label: "Research", href: "/research" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const siteNavItems = primaryNavItems;
export const footerNavItems = [...primaryNavItems, ...supportNavItems];
export const landingNavItems = siteNavItems;
export const catalogNavItems = siteNavItems;
export const companyNavItems = siteNavItems;
export const sellNavItems = siteNavItems;
export const facilityNavItems = siteNavItems;

export const sessionSteps = [
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

export const roomZones = [
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

export const bodyStates = [
  "まぶたは閉じたままでも、記憶の中では視界が立ち上がる",
  "身体は椅子にあるが、足裏や指先に別の場所の感触が残る",
  "強い場面では脈拍が上がるため、自動的に再生速度が落ちる",
  "声を出せない状態ではなく、違和感があれば停止ワードで中断できる",
  "終了直後は夢より鮮明で、現実の出来事より少しだけ輪郭が柔らかい",
];

export const experienceEntryOptions = [
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

export const intakeChecks = [
  "体験したい記憶の種類",
  "残したい余韻の強さ",
  "現実と混同しやすい出来事の有無",
  "避けたい感情や場面",
  "終了後に必要な休憩時間",
];

export const bookingSteps = [
  "体験内容の確認",
  "希望日時の選択",
  "来館前説明の予約",
  "同意事項の確認",
];

export const plans: Plan[] = [
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

export const purchaseUseCases: PurchaseUseCase[] = [
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

export const experienceMenus: ExperienceTemplate[] = [
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

export const memoryEpisodes: MemoryEpisode[] = [
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

export const valuation: SimpleCard[] = [
  { title: "感情強度", description: "歓喜、喪失、緊張、安堵など、記憶に残る感情の深さを測定します。" },
  { title: "希少性", description: "一般的には体験困難な状況、職能、場所、人生局面ほど高く評価されます。" },
  { title: "物語性", description: "始まり、転機、結末がある記憶は、体験商品として再構成しやすくなります。" },
  { title: "感覚情報の鮮明さ", description: "匂い、温度、音、身体感覚の密度が没入度の基礎になります。" },
  { title: "倫理審査レベル", description: "第三者情報や心理負荷を評価し、安全な流通範囲を決定します。" },
  { title: "再体験需要", description: "購入者が求める願望、学習、憧れとの一致度を分析します。" },
];

export const categories: SimpleCard[] = [
  { title: "First Love Memory", description: "初恋、告白、失恋、再会など、感情強度の高い記憶。" },
  { title: "Extreme Survival", description: "遭難、災害、極限状態からの生還など、危険度の高い体験。" },
  { title: "Professional Mastery", description: "一流職人、外科医、音楽家、アスリートなどの熟練体験。" },
  { title: "Executive Decision", description: "経営判断、交渉、勝負の瞬間など、責任ある立場の記憶。" },
  { title: "Hidden Travel", description: "普通の観光では得られない、個人的で濃密な旅の記憶。" },
  { title: "Farewell Archive", description: "別れ、喪失、卒業、人生の転機に関する記憶。" },
];

export const sellSteps = [
  "事前カウンセリング",
  "記憶候補の登録",
  "感情強度・希少性スキャン",
  "匿名化・第三者情報除去",
  "倫理審査",
  "価格査定",
  "ライセンス契約",
  "マーケットプレイス掲載",
];

export const safetyItems = [
  "記憶挿入前の心理スキャン",
  "記憶と現実の境界維持プロトコル",
  "緊急覚醒システム",
  "認定ニューロエンジニア監修",
  "体験後の認知安定セッション",
  "記憶混同リスクの事前評価",
  "高リスク記憶の段階的再生制御",
];

export const ethics = [
  "本人同意なしの記憶抽出は禁止",
  "第三者の個人情報は自動匿名化",
  "トラウマ記憶は高リスク審査対象",
  "未成年期の記憶は制限付き",
  "犯罪・暴力・搾取に関わる記憶は厳格審査",
  "独占ライセンス契約では、提供者側の記憶アクセスに制限が発生する可能性がある",
  "購入者には、体験後の現実復帰ガイダンスを提供する",
];

export const reviews: Review[] = [
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

export const faqs: Faq[] = [
  {
    question: "これは夢ですか？",
    answer: "夢ではありません。NEURAMNESIA は体験後に残る記憶印象を設計する架空のサービスです。目覚めたあとも、記憶は静かに日常へ重なります。",
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
];

export const faqsSell: Faq[] = [
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

