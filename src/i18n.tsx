import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "ja" | "en";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const STORAGE_KEY = "neuramnesia-language";

const translations: Record<string, string> = {
  "カタログ": "Catalog",
  "体験": "Experience",
  "予約": "Booking",
  "施設": "Facility",
  "安全性": "Safety",
  "記憶を売る": "Sell Memory",
  "よくある質問": "FAQ",
  "会社情報": "About",
  "お問い合わせ": "Contact",
  "記憶体験マーケットプレイス": "Memory Experience Marketplace",
  "あなたが本当に欲しかった人生を、記憶から始めよう。": "Start the life you truly wanted from memory.",
  "Neuramnesia は、恋愛、成功、旅行、結婚、挫折、性別を入れ替えた人生まで、経験できなかった過去を記憶として購入できるマーケットプレイスです。":
    "Neuramnesia is a marketplace where you can purchase unlived pasts as memories, from romance, success, travel, marriage, and failure to lives lived from another identity.",
  "Neuramnesia の体験は、あなたの現在を変えずに、あなたの過去の輪郭だけを増やします。":
    "A Neuramnesia experience does not change your present; it only expands the outline of your past.",
  "青春の恋も、行けなかった旅も、選ばなかった結婚も。": "First love, the trip you never took, the marriage you never chose.",
  "幸せな記憶も、挫折の記憶も、人生の厚みとして手に入れる。": "Add both joyful memories and memories of failure to the texture of your life.",
  "あなたの人生は、本当にこれだけですか？": "Is this really all your life can be?",
  "毎日同じ通勤、同じ仕事、同じ夜。": "The same commute, the same work, the same nights.",
  "本当に欲しかった人生は、まだ体験できていない。": "The life you truly wanted has not been experienced yet.",
  "あなたがすでに体験した人生の一部は、誰かにとって強く望まれる記憶かもしれない。":
    "Parts of the life you have already lived may be memories someone else deeply longs for.",
  "記憶は、消えていくものではなく、保存され、編集され、流通する資産になりつつある。":
    "Memory is becoming an asset that can be preserved, edited, and circulated.",
  "買う理由は、後悔だけではない。": "People buy memories for more than regret.",
  "NEURAMNESIA は「なかったことを埋める」だけのサービスではありません。恋愛、成功、旅行、結婚、性別、挫折。人生の手触りを増やすために、欲しい記憶を選べます。":
    "NEURAMNESIA is not only a service for filling what never happened. Choose memories that add texture to your life: romance, success, travel, marriage, identity, and failure.",
  "買いたくなる過去を、記憶メニューから選ぶ。": "Choose a past worth buying from the memory menu.",
  "ここでは、購入可能な記憶体験を一覧できます。短い思い出から、選ばなかった人生、物語性の強い記憶まで、体験したい過去を選べます。":
    "Browse purchasable memory experiences, from short recollections to unlived lives and story-rich memories.",
  "あったかもしれない人生を選ぶ。": "Choose the life that might have been.",
  "スポーツ選手、アーティスト、仮想ヒーロー、異世界転生。まず体験したい人生の型を選び、そこから具体的な記憶商品へ進めます。":
    "Athlete, artist, virtual hero, otherworld rebirth. Start with a life template, then move into specific memory products.",
  "長編テンプレート": "Long-form Templates",
  "一生ではなく、あの数時間を買う。": "Buy those few hours, not an entire life.",
  "青春、部活、恋愛、幼少期、敗北、達成。NEURAMNESIA では、一生分ではない短い記憶エピソードも選べます。":
    "Youth, club activities, romance, childhood, defeat, achievement. NEURAMNESIA also offers short memory episodes.",
  "経験したかった人生を、記憶として購入する。": "Purchase the life you wanted to experience as a memory.",
  "体験するか、提供するか。NEURAMNESIA は、あなたの過去と未来に新しい選択肢を与えます。":
    "Experience or provide. NEURAMNESIA gives your past and future new choices.",
  "本サイトおよび NEURAMNESIA は架空の企業・サービスです。実在する医療・金融・記憶操作サービスではありません。":
    "This website and NEURAMNESIA are fictional. They are not real medical, financial, or memory manipulation services.",
  "記憶を購入する方へ": "For Memory Buyers",
  "記憶を売る方へ": "For Memory Sellers",
  "スパン": "Span",
  "感情": "Emotion",
  "由来": "Source",
  "予約内容を送信しています。": "Sending your reservation.",
  "希望日時、記憶タイプ、来館前説明の内容を NEURAMNESIA 予約プロトコルに登録しています。":
    "Registering your preferred date, memory type, and pre-visit briefing with the NEURAMNESIA reservation protocol.",
  "予約内容の検証": "Validating reservation details",
  "境界タグの仮登録": "Pre-registering boundary tags",
  "来館前説明の割り当て": "Assigning pre-visit briefing",
  "この送信中表示はデモ演出です。実際の外部送信やメール送信は行われません。":
    "This sending state is a demo effect. No external transmission or email is actually sent.",
  "予約内容を送信しました。": "Your reservation has been received.",
  "来館予定": "Scheduled Visit",
  "記憶タイプ": "Memory Type",
  "感情の強さ": "Emotional Intensity",
  "来館前説明": "Pre-visit Briefing",
  "連絡先": "Contact",
  "未入力": "Not entered",
  "事前メモ": "Pre-visit Notes",
  "別のメニューを見る": "View Other Menus",
  "予約内容を修正する": "Edit Reservation",
  "この送信結果はデモ表示です。実際の予約受付、メール送信、医療行為、記憶操作サービスは行われません。":
    "This confirmation is a demo. No real reservation, email, medical act, or memory manipulation service is performed.",
  "体験内容を確認して、日時を予約します。": "Review the experience and reserve a date.",
  "ここでは、体験したい記憶の種類、感情の強さ、希望日時、来館前説明の方法を確認します。長い人生記憶は1回で完了させず、スタッフによる事前確認後に必要なセッション回数を提案します。":
    "Here you confirm the memory type, emotional intensity, preferred date, and pre-visit briefing method. Long-form life memories are not completed in one session; staff will propose the needed number of sessions after a preliminary review.",
  "弱め": "Gentle",
  "標準": "Standard",
  "強め": "Intense",
  "10:00 初回確認": "10:00 Initial Review",
  "13:00 初回確認": "13:00 Initial Review",
  "16:00 初回確認": "16:00 Initial Review",
  "19:00 初回確認": "19:00 Initial Review",
  "オンライン説明を受ける": "Receive an online briefing",
  "当日、施設で説明を受ける": "Receive the briefing onsite",
  "施設見学を先に予約する": "Book a facility tour first",
  "希望日": "Preferred Date",
  "希望時間": "Preferred Time",
  "お名前": "Name",
  "名前を入力してください": "Enter your name",
  "メールアドレス": "Email Address",
  "事前に伝えておきたいこと": "Anything to tell us beforehand",
  "避けたい記憶、苦手な感覚、当日不安なことなど": "Memories to avoid, uncomfortable sensations, or concerns about the day",
  "予約後にスタッフが内容を確認し、必要に応じて体験内容を調整することに同意します。":
    "I agree that staff will review the request after booking and adjust the experience if needed.",
  "送信中...": "Sending...",
  "予約内容を送信する": "Send Reservation",
  "体験内容を見直す": "Review Experience",
  "この予約フォームはデモです。実際の医療行為や記憶操作サービスではありません。送信後は入力内容をもとにした予約確認表示へ切り替わります。":
    "This reservation form is a demo. It is not a real medical or memory manipulation service. After sending, it switches to a confirmation view based on your inputs.",
  "体験内容の確認": "Experience Review",
  "希望日時の選択": "Choose Date and Time",
  "来館前説明の予約": "Pre-visit Briefing",
  "同意事項の確認": "Consent Review",
  "短い思い出から試す": "Start with a Short Memory",
  "放課後の告白、旅先の朝、試合前の緊張など、人生のポイントになる場面を軽く体験します。":
    "Lightly experience pivotal moments such as an after-school confession, a morning while traveling, or pre-game tension.",
  "ポイント記憶": "Point Memory",
  "30-60分": "30-60 min",
  "数十分-数日分": "Minutes to several days",
  "選ばなかった人生を体験する": "Experience an Unchosen Life",
  "結婚、仕事、移住、別の役割など、現実では選ばなかった人生の分岐を数年単位の記憶として受け取ります。":
    "Receive memories of life branches you did not choose, such as marriage, work, relocation, or another role.",
  "人生分岐記憶": "Life Branch Memory",
  "60分 x 複数回": "60 min x multiple sessions",
  "6か月-10年分": "6 months to 10 years",
  "強い物語記憶に入る": "Enter a Strong Story Memory",
  "ヒーロー、異世界、極限体験など、感情の振れ幅が大きい記憶を段階的に定着させます。":
    "Gradually fix memories with a wide emotional range, such as heroes, other worlds, and extreme experiences.",
  "物語記憶": "Story Memory",
  "60分から": "From 60 min",
  "数日-数年分": "Several days to several years",
  "体験したい記憶の種類": "Type of memory you want to experience",
  "残したい余韻の強さ": "Strength of the afterglow you want to keep",
  "現実と混同しやすい出来事の有無": "Events that may be easy to confuse with reality",
  "避けたい感情や場面": "Emotions or scenes to avoid",
  "終了後に必要な休憩時間": "Rest time needed after completion",
  "体験したい記憶を、ここから選びます。": "Choose the memory you want to experience.",
  "初回は、記憶の種類と感情の強さを確認しながら進めます。いきなり定着に入るのではなく、体験したい過去、避けたい場面、終了後に残したい余韻を一つずつ整理します。":
    "The first step confirms the memory type and emotional intensity. Instead of jumping into fixation, we organize the past you want to experience, scenes to avoid, and the aftertaste you want to keep.",
  "初回確認": "Initial Review",
  "定着強度": "Fixation Strength",
  "中断": "Interruption",
  "約30分": "About 30 minutes",
  "記憶タイプで変動": "Varies by memory type",
  "Low から開始": "Starts from Low",
  "いつでも可能": "Available anytime",
  "このページは体験の入口です。購入や予約を確定する前に、記憶の内容と安全確認を整理できます。":
    "This page is the entry point for the experience. Before confirming purchase or booking, you can organize the memory content and safety checks.",
  "まずは、体験したい記憶のタイプを選びます。": "First, choose the type of memory you want to experience.",
  "ここでは大まかな記憶タイプだけを選びます。短い場面の記憶は1回の体験で扱えますが、数年分の人生記憶は複数回のセッションに分けて定着させます。":
    "Here you only choose a broad memory type. Short scene memories can be handled in one session, while multi-year life memories are fixed across multiple sessions.",
  "選択中": "Selected",
  "クリックして選択": "Click to select",
  "体験前に確認すること。": "What to confirm before the experience.",
  "記憶定着は、希望を聞いてすぐ始めるものではありません。心地よく持ち帰れる記憶にするため、以下の項目を確認します。":
    "Memory fixation does not begin immediately after a request. To make the memory something you can comfortably carry home, we check the following items.",
  "体験したい記憶": "Desired Memory",
  "弱めに始めたい": "Start gently",
  "標準で体験したい": "Experience at standard intensity",
  "強めの余韻を残したい": "Keep a stronger afterglow",
  "重点的に確認したいこと": "Items to check carefully",
  "避けたい場面": "Scenes to avoid",
  "例: 大きな音、強い喪失感、狭い場所": "Example: loud sounds, intense loss, confined spaces",
  "体験内容を確認して予約へ進む": "Review experience and proceed to booking",
  "Catalog に戻る": "Back to Catalog",
  "Short Memories に戻る": "Back to Short Memories",
  "この人生を予約する": "Reserve This Life",
  "境界タグを確認する": "Check Boundary Tags",
  "Memory Spec": "Memory Spec",
  "体験時間": "Experience Time",
  "記憶内期間": "Memory Span",
  "リスク": "Risk",
  "構成": "Structure",
  "連続人生テンプレート": "Continuous Life Template",
  "体験後には、現実の経歴ではなく「記憶として経験した人生」として境界タグが付与されます。強い余韻を伴うテンプレートでは、数日間の余韻が残る場合があります。":
    "After the session, a boundary tag marks it as a life experienced as memory, not as your real history. Templates with strong afterglow may leave an emotional residue for several days.",
  "このテンプレートに含まれる記憶章。": "Memory chapters included in this template.",
  "単なるハイライトではなく、成功する前の逡巡、失敗、身体の違和感まで含めて再構成されます。":
    "It is reconstructed not as simple highlights, but with hesitation, failure, and bodily unease before success.",
  "残る感覚情報": "Sensory Traces",
  "購入前プロトコル": "Pre-purchase Protocol",
  "このテンプレートに近い記憶商品。": "Memory products close to this template.",
  "この思い出を予約する": "Reserve This Memory",
  "感情強度を調整する": "Adjust Emotional Intensity",
  "Episode Spec": "Episode Spec",
  "形式": "Format",
  "短編記憶エピソード": "Short Memory Episode",
  "短編記憶は、一生分の経歴ではなく、数十分から数日だけの濃い場面を体験する商品です。購入後は「自分が本当に経験した過去」ではなく「購入した記憶」として認識できる境界タグが付与されます。":
    "A short memory is not a full life history, but a concentrated scene lasting from minutes to days. After purchase, a boundary tag lets you recognize it as a purchased memory, not a real past.",
  "体験中に流れるストーリー。": "Story flow during the experience.",
  "購入前に、どんな順番で記憶が展開されるかを確認できます。":
    "Before purchase, you can review the order in which the memory unfolds.",
  "体験内容の詳細": "Experience Details",
  "残る感覚": "Remaining Sensations",
  "購入前に確認すること。": "What to confirm before purchase.",
  "他の短編記憶を見る": "View Other Short Memories",
  "記憶内の期間": "Period Inside the Memory",
  "まず、体験したい記憶の方向性を確認します。ここで選ぶのは大枠です。具体的な記憶メニューは予約後の説明で調整できます。":
    "First, we confirm the direction of the memory you want to experience. This is only the broad frame; specific memory menus can be adjusted after booking.",
  "次に、残したい余韻や避けたい感情を確認します。不安な場面がある場合は、右側のフォームで複数選択できます。":
    "Next, we confirm the afterglow you want to keep and emotions you want to avoid. If there are uncomfortable scenes, you can select several on the form.",
  "最後に、予約ページで日時と来館前説明の方法を選びます。長い人生記憶は、初回確認後に必要な回数を提案します。":
    "Finally, choose the date, time, and pre-visit briefing method on the booking page. For long life memories, we suggest the required number of sessions after the first review.",
  "あなたの記憶を、誰かの体験したかった人生へ。": "Turn your memory into the life someone wanted to experience.",
  "売却ページでは、提供者向けに記憶の査定、匿名化、ライセンス、掲載までの流れを案内します。購入者向けの会社情報とは分けて、記憶を提供する人が確認すべき条件だけを整理しています。":
    "This seller page explains valuation, anonymization, licensing, and listing for memory providers. It separates seller conditions from buyer-facing company information.",
  "査定基準を見る": "View Valuation Criteria",
  "売却プロセスを見る": "View Selling Process",
  "感情強度": "Emotional Intensity",
  "希少性": "Rarity",
  "物語性": "Narrative Quality",
  "感覚情報の鮮明さ": "Sensory Clarity",
  "通常売却では、提供者自身の記憶は失われません。独占ライセンス契約では、契約範囲に応じて一部アクセス制限が発生する場合があります。":
    "In a standard sale, the provider does not lose their own memory. Exclusive licenses may create partial access limits depending on the contract scope.",
  "記憶資産の査定基準。": "Valuation criteria for memory assets.",
  "初恋、成功、挫折、旅、勝負の瞬間。NEURAMNESIA は、提供者の同意に基づいて記憶を匿名化し、感情強度・希少性・没入度・安全性を評価します。":
    "First love, success, failure, travel, decisive moments. NEURAMNESIA anonymizes memories with provider consent and evaluates emotional intensity, rarity, immersion, and safety.",
  "歓喜、喪失、緊張、安堵など、記憶に残る感情の深さを測定します。":
    "Measures the depth of memorable emotions such as joy, loss, tension, and relief.",
  "一般的には体験困難な状況、職能、場所、人生局面ほど高く評価されます。":
    "Situations, skills, places, and life stages that are difficult to experience are generally valued higher.",
  "始まり、転機、結末がある記憶は、体験商品として再構成しやすくなります。":
    "Memories with a beginning, turning point, and ending are easier to reconstruct as experience products.",
  "匂い、温度、音、身体感覚の密度が没入度の基礎になります。":
    "The density of smell, temperature, sound, and bodily sensation forms the basis of immersion.",
  "倫理審査レベル": "Ethics Review Level",
  "第三者情報や心理負荷を評価し、安全な流通範囲を決定します。":
    "Evaluates third-party information and psychological load to determine a safe distribution range.",
  "再体験需要": "Re-experience Demand",
  "購入者が求める願望、学習、憧れとの一致度を分析します。":
    "Analyzes fit with the desire, learning, and longing buyers are seeking.",
  "記憶を売る流れ。": "How selling a memory works.",
  "事前カウンセリング": "Pre-counseling",
  "記憶候補の登録": "Register candidate memories",
  "感情強度・希少性スキャン": "Emotional intensity and rarity scan",
  "匿名化・第三者情報除去": "Anonymization and third-party data removal",
  "倫理審査": "Ethics review",
  "価格査定": "Price valuation",
  "ライセンス契約": "License contract",
  "マーケットプレイス掲載": "Marketplace listing",
  "記憶を買う前に、安全基準を確認する。": "Review safety standards before buying a memory.",
  "NEURAMNESIA は、購入した記憶が日常へ戻る力を壊さないよう、体験前、体験中、体験後の各段階で境界タグ、感情強度、現実混同リスクを管理します。":
    "NEURAMNESIA manages boundary tags, emotional intensity, and reality-confusion risk before, during, and after each experience so purchased memories do not damage your return to daily life.",
  "必須": "Required",
  "自動付与": "Auto-applied",
  "事前評価": "Pre-assessed",
  "全体験に付属": "Included with every experience",
  "体験前後の安全管理。": "Safety management before and after the experience.",
  "安全基準は購入前の判断材料です。どの記憶を選ぶ場合でも、体験内容より先に確認できる独立ページとして公開しています。":
    "Safety standards are decision material before purchase. They are published as an independent page you can review before choosing any memory.",
  "記憶挿入前の心理スキャン": "Psychological scan before memory insertion",
  "記憶と現実の境界維持プロトコル": "Memory-reality boundary protocol",
  "緊急覚醒システム": "Emergency awakening system",
  "認定ニューロエンジニア監修": "Supervised by certified neuro-engineers",
  "体験後の認知安定セッション": "Post-experience cognitive stabilization",
  "記憶混同リスクの事前評価": "Pre-assessment of memory confusion risk",
  "高リスク記憶の段階的再生制御": "Staged playback control for high-risk memories",
  "倫理プロトコル。": "Ethical protocol.",
  "本人同意なしの記憶抽出は禁止": "Memory extraction without personal consent is prohibited",
  "第三者の個人情報は自動匿名化": "Third-party personal information is automatically anonymized",
  "トラウマ記憶は高リスク審査対象": "Trauma memories are subject to high-risk review",
  "未成年期の記憶は制限付き": "Memories from childhood are restricted",
  "犯罪・暴力・搾取に関わる記憶は厳格審査": "Memories involving crime, violence, or exploitation receive strict review",
  "独占ライセンス契約では、提供者側の記憶アクセスに制限が発生する可能性がある":
    "Exclusive license contracts may limit the provider's access to the memory",
  "購入者には、体験後の現実復帰ガイダンスを提供する":
    "Buyers receive post-experience guidance for returning to reality",
  "記憶定着の流れを、事前に確認できます。": "You can review the memory fixation flow in advance.",
  "体験者が最初に知りたいのは、技術の名前よりも、自分がどこに座り、何を頭に付けられ、どんな感覚の中で記憶が入ってくるのかです。NEURAMNESIA の施設は、その不安を減らすために公開されています。":
    "What visitors first want to know is not the name of the technology, but where they sit, what is placed on their head, and what it feels like as the memory enters. The NEURAMNESIA facility is shown to reduce that uncertainty.",
  "2名常駐": "Two staff onsite",
  "音声中断可": "Voice interruption available",
  "全国3拠点で記憶定着セッションを実施": "Memory fixation sessions available at three locations nationwide",
  "記憶の購入はオンラインで完結しますが、実際の記憶定着セッションは専用施設で行います。日時を予約いただければ、記憶の選択は来館時でも可能です。カウンセリングを受けながら、その場で最適な記憶を選べます。":
    "Memory purchases can be completed online, but fixation sessions take place at dedicated facilities. Once you reserve a date, you can also choose the memory onsite with counseling.",
  "東京ラボ": "Tokyo Lab",
  "東京都港区虎ノ門 4-1-1": "4-1-1 Toranomon, Minato-ku, Tokyo",
  "大阪ラボ": "Osaka Lab",
  "大阪府大阪市北区梅田 2-5-8": "2-5-8 Umeda, Kita-ku, Osaka",
  "福岡ラボ": "Fukuoka Lab",
  "福岡県福岡市中央区天神 1-10-3": "1-10-3 Tenjin, Chuo-ku, Fukuoka",
  "安心して体験に入れる、静かな空間です。": "A quiet space where you can enter the experience with confidence.",
  "施設の安心感は、説明の丁寧さだけでなく、入った瞬間に身体がどう反応するかで決まります。体験前後の部屋を分け、記憶と現実が急に混ざらない動線にしています。":
    "A facility feels safe not only through careful explanation, but through how your body reacts when you enter. Rooms before and after the experience are separated so memory and reality do not mix abruptly.",
  "白い診察室ではなく、低い照明と吸音パネルのある待機室です。体験前の緊張を下げるため、説明はすべて座ったまま受けられます。":
    "Rather than a white examination room, this is a waiting lounge with low lighting and acoustic panels. All explanations are given while seated to reduce pre-experience tension.",
  "頭部センサー、香気カートリッジ、骨伝導音響、体圧制御シートを一体化した定着用チェアです。利用者は常にスタッフの視界内にいます。":
    "A fixation chair integrating head sensors, scent cartridges, bone-conduction audio, and body-pressure control. Users remain in staff view at all times.",
  "覚醒後にすぐ現実へ戻しすぎないための小部屋です。水、鏡、日付表示、短い会話で、購入した記憶と今日の自分を分け直します。":
    "A small room that prevents an abrupt return to reality after waking. Water, a mirror, date display, and brief conversation help separate the purchased memory from today's self.",
  "来館からお帰りまでの流れをご案内します。": "A guide from arrival to departure.",
  "体験者は眠らされるのではなく、浅い睡眠に近い状態へ誘導されます。スタッフ、機械、本人の停止合図が同時にセッションを見守ります。":
    "Visitors are not put to sleep; they are guided into a state close to light sleep. Staff, machines, and the user's stop signal monitor the session together.",
  "受付と境界タグの確認": "Reception and boundary tag confirmation",
  "体験する記憶の種類、強度、残したい余韻を確認します。本人同意、現実の記憶との境界タグ、途中停止の合図をここで固定します。":
    "Confirm the memory type, intensity, and desired afterglow. Consent, boundary tags with real memories, and the stop signal are fixed here.",
  "リクライニングポッドへ着席": "Seated in the reclining pod",
  "体温、脈拍、眼球運動を取りながら、首と肩が緩む角度に調整します。拘束ではなく、眠りに落ちる前の姿勢を保つための支持です。":
    "Body temperature, pulse, and eye movement are monitored while the chair is adjusted to relax the neck and shoulders. It is support for a pre-sleep posture, not restraint.",
  "ニューロクラウン装着": "Neuro-crown placement",
  "記憶定着フェーズ": "Memory fixation phase",
  "名前、日付、現在地、購入した記憶であることを確認します。余韻が強い場合は照明を落としたまま、認知安定セッションを延長します。":
    "Confirm your name, date, current location, and that the memory was purchased. If the afterglow is strong, lighting remains low and cognitive stabilization is extended.",
  "記憶定着は、リラックスした状態で行われます。": "Memory fixation is performed in a relaxed state.",
  "目を閉じ、呼吸はゆっくりになり、時々指先や表情だけが反応します。中では記憶が再生されているのではなく、感情と感覚の順番が本人の中に結び直されています。":
    "Eyes close, breathing slows, and only fingertips or facial expressions sometimes react. Inside, the memory is not simply replayed; the order of emotions and sensations is reconnected within the person.",
  "高級マッサージチェアに近い姿勢で、柔らかいニューロクラウンを装着します。身体を拘束せず、スタッフが離れた端末から状態を見守ります。":
    "You wear a soft neuro-crown in a posture close to a premium massage chair. The body is not restrained, and staff monitor status from a nearby terminal.",
  "まぶたは閉じたままでも、記憶の中では視界が立ち上がる": "Even with eyes closed, vision rises inside the memory",
  "身体は椅子にあるが、足裏や指先に別の場所の感触が残る": "The body is in the chair, but the soles and fingertips retain sensations from elsewhere",
  "強い場面では脈拍が上がるため、自動的に再生速度が落ちる": "In intense scenes, pulse rises and playback automatically slows",
  "声を出せない状態ではなく、違和感があれば停止ワードで中断できる": "You are not unable to speak; if something feels wrong, a stop word can interrupt",
  "終了直後は夢より鮮明で、現実の出来事より少しだけ輪郭が柔らかい": "Immediately afterward it is clearer than a dream, but slightly softer than real events",
  "体験後は、ゆっくり日常へ戻ります。": "After the experience, you return slowly to everyday life.",
  "体験後は、購入した記憶を否定せず、現実の履歴とも混ぜすぎない時間を置きます。水を飲む、日付を見る、短い会話をする。その小さな手順が、記憶を安心して持ち帰るための最後の設備です。":
    "Afterward, time is set aside to neither reject the purchased memory nor mix it too much with real history. Drinking water, seeing the date, and having a short conversation are the final tools for carrying the memory home safely.",
  "よくある質問へ": "Go to FAQ",
  "記憶体験を設計する、架空の研究企業。": "A fictional research company designing memory experiences.",
  "NEURAMNESIA は、経験できなかった恋愛、選ばなかった人生、行けなかった旅、味わえなかった成功や挫折を、記憶体験として設計する研究企業です。人生をやり直すのではなく、あなたの中にもうひとつの過去を増やします。":
    "NEURAMNESIA is a research company that designs unlived romances, unchosen lives, missed journeys, and unexperienced successes or failures as memory experiences. It does not redo life; it adds another past inside you.",
  "私たちが目指すこと。": "What we aim for.",
  "経験の格差をなくす": "Reduce the experience gap",
  "生まれた場所、時代、環境によって体験できる人生は限られます。NEURAMNESIA は、誰もが望んだ経験を記憶として持ち帰れる世界を構想しています。":
    "The lives people can experience are limited by birthplace, era, and environment. NEURAMNESIA imagines a world where anyone can take home the experiences they wanted as memories.",
  "記憶を安全に流通させる": "Circulate memories safely",
  "記憶は個人の最も繊細な資産です。同意、匿名化、境界タグ、倫理審査を経て、安全に体験商品として届けるインフラを構築します。":
    "Memory is one of the most delicate personal assets. We build infrastructure to deliver it safely as an experience product through consent, anonymization, boundary tags, and ethics review.",
  "現実を壊さない": "Do not break reality",
  "購入した記憶が日常を侵食しないよう、体験前後の境界設計と認知安定プロトコルを全セッションに組み込みます。":
    "Every session includes boundary design and cognitive stabilization before and after the experience so purchased memories do not erode daily life.",
  "提供者を守る": "Protect providers",
  "記憶を売る側の権利と安全を最優先に設計します。本人同意なしの抽出は禁止、匿名化は自動、独占契約の影響も事前に説明します。":
    "We prioritize the rights and safety of people who sell memories. Extraction without consent is prohibited, anonymization is automatic, and the effects of exclusive contracts are explained in advance.",
  "会社情報。": "Company information.",
  "社名の由来": "Origin of the company name",
  "記憶を失うのではなく、新しい記憶を神経レベルで獲得する。失われた過去を取り戻すのではなく、経験できなかった過去を創造する。そんな逆説的な意味を込めています。":
    "It means not losing memories, but acquiring new ones at a neural level; not recovering a lost past, but creating an unlived one.",
  "社名": "Company Name",
  "設立": "Founded",
  "2029年4月": "April 2029",
  "所在地": "Location",
  "東京都港区虎ノ門 4-1-1（架空）": "4-1-1 Toranomon, Minato-ku, Tokyo (fictional)",
  "代表": "Representative",
  "Dr. Rei Kurosawa（架空）": "Dr. Rei Kurosawa (fictional)",
  "事業内容": "Business",
  "記憶体験の設計・販売・査定、記憶安全基準の策定、記憶資産マーケットプレイスの運営":
    "Design, sale, and valuation of memory experiences; memory safety standards; operation of a memory asset marketplace",
  "従業員数": "Employees",
  "約120名（架空）": "Approx. 120 (fictional)",
  "資本金": "Capital",
  "48億円（架空）": "4.8 billion yen (fictional)",
  "お問い合わせ。": "Contact us.",
  "記憶体験に関するご質問、売却のご相談、施設見学のご希望など、お気軽にお問い合わせください。通常2営業日以内にご返信いたします。":
    "Contact us with questions about memory experiences, selling memories, or facility tours. We usually reply within two business days.",
  "連絡先情報": "Contact Information",
  "東京都港区虎ノ門 4-1-1 NEURAMNESIA Tower 12F（架空）": "NEURAMNESIA Tower 12F, 4-1-1 Toranomon, Minato-ku, Tokyo (fictional)",
  "メール": "Email",
  "電話": "Phone",
  "03-XXXX-XXXX（架空）": "03-XXXX-XXXX (fictional)",
  "営業時間": "Business Hours",
  "平日 10:00 - 19:00": "Weekdays 10:00 - 19:00",
  "お問い合わせ種別": "Inquiry Type",
  "記憶体験について": "About memory experiences",
  "記憶の売却について": "About selling memories",
  "施設見学について": "About facility tours",
  "安全基準について": "About safety standards",
  "法人・パートナーシップ": "Corporate / Partnership",
  "その他": "Other",
  "お問い合わせ内容": "Inquiry Details",
  "送信する": "Send",
  "このお問い合わせフォームはデモです。実際の送信やメール配信は行われません。":
    "This contact form is a demo. No actual submission or email delivery is performed.",
  "青春を補う": "Recover Youth",
  "Short Memory / 3時間から": "Short Memory / from 3 hours",
  "恋愛に踏み出せなかった人へ": "For people who never stepped into romance",
  "学生時代の恋愛を、後から人生に足す。": "Add student romance to your life afterward.",
  "放課後の告白、文化祭の帰り道、卒業式で言えなかった一言。派手な成功ではなく、胸が少し痛むくらいの青春を購入できます。":
    "An after-school confession, the walk home from a school festival, words left unsaid at graduation. Buy a youth memory that aches a little rather than a flashy success.",
  "放課後の教室で告白する": "Confess in an after-school classroom",
  "雨の日に相合傘で帰る": "Share an umbrella on a rainy day",
  "卒業前日に返事をもらう": "Receive an answer the day before graduation",
  "後悔をほどく": "Unwind Regret",
  "Life Branch / 6か月から": "Life Branch / from 6 months",
  "選ばなかった分岐が残っている人へ": "For people still carrying an unchosen branch",
  "結婚した人生、独身だった人生を体験する。": "Experience the life where you married, or the one where you stayed single.",
  "結婚式の朝、子どもを寝かしつけた夜、ひとりで海外赴任を選んだ朝。どちらが正解だったかではなく、選ばなかった人生にも触れて後悔を小さくします。":
    "The morning of a wedding, a night putting a child to bed, the morning you chose an overseas post alone. It is not about which was right; it lets you touch the unchosen life and soften regret.",
  "結婚した世界線の10年間": "Ten years in a married timeline",
  "独身で仕事に振り切った5年間": "Five years fully committed to work while single",
  "離婚後に自分を取り戻す半年": "Six months reclaiming yourself after divorce",
  "成功を味わう": "Taste Success",
  "届かなかった舞台がある人へ": "For people with a stage they never reached",
  "成功した自分の記憶を、現実の背中に入れる。": "Place the memory of a successful self behind your real life.",
  "大企業のCEOとして買収を決断する": "Decide an acquisition as the CEO of a major company",
  "全国大会の決勝に立つ": "Stand in the national final",
  "初個展で作品が売れる": "Sell a work at your first solo exhibition",
  "旅を取り戻す": "Recover Travel",
  "時間がなかった人へ": "For people who never had the time",
  "行けなかった旅行を、思い出として持ち帰る。": "Take the trip you never made home as a memory.",
  "若い頃に行きたかったヨーロッパ一人旅、家族で見たかった海、老後まで延ばしていた世界一周。写真ではなく、移動の疲れや朝の空気まで記憶にします。":
    "A solo trip through Europe you wanted when young, the sea you wanted to see with family, a world cruise postponed until old age. Not photos, but the fatigue of travel and morning air become memory.",
  "新婚旅行で見た南の海": "A southern sea seen on a honeymoon",
  "退職後の世界一周クルーズ": "A round-the-world cruise after retirement",
  "人生を反転する": "Invert a Life",
  "別の身体、別の社会的位置から生きたかった人へ": "For people who wanted to live from another body or social position",
  "性別や役割を入れ替えた人生を経験する。": "Experience a life with a different gender or role.",
  "別の性別で迎える成人式": "A coming-of-age ceremony in another gender",
  "物語のヒロインとして選択する夜": "A night of choice as the heroine of a story",
  "家族を支える側の20年": "Twenty years as the one supporting a family",
  "痛みを得る": "Gain Pain",
  "負けた経験が少ない人へ": "For people with little experience of defeat",
  "挫折や失敗を、人生の奥行きとして取り入れる。": "Take failure and defeat in as depth for your life.",
  "最後の試合でベンチのまま終わる": "End the final game still on the bench",
  "好きな人に選ばれない": "Not be chosen by the person you love",
  "起業に失敗し、もう一度始める": "Fail at a startup and begin again",
  "現実ではなく、記憶として体験する。": "Experience it as memory, not reality.",
  "人工記憶や編集済みの実体験記憶によって、特別な人生を記憶として体験できます。":
    "Experience a special life as memory through artificial or edited real memories.",
  "体験は数十分でも、記憶上は数日・数週間の冒険として残ります。":
    "Even if the session lasts minutes, it can remain as days or weeks of adventure in memory.",
  "感情強度、物語性、感覚情報、倫理審査レベルに基づいて調整されます。":
    "Adjusted according to emotional intensity, narrative quality, sensory information, and ethics review level.",
  "体験前にカウンセリングと記憶整合性チェックを行います。":
    "Counseling and memory consistency checks are performed before the experience.",
  "体験後には現実復帰のための認知安定プロトコルを行います。":
    "After the experience, a cognitive stabilization protocol helps you return to reality.",
  "人生は、共有できる資産になる。": "A life can become a shareable asset.",
  "他人の人生の一部や、編集済みの冒険・成功・恋愛・旅・極限体験を記憶として体験できます。":
    "Experience parts of another life or edited adventures, successes, romances, travels, and extreme situations as memories.",
  "提供者は、自分の記憶を記憶資産として登録し、査定結果に応じてライセンスできます。":
    "Providers can register their memories as memory assets and license them according to valuation results.",
  "欲しかった人生は、メニューにある。": "The life you wanted is on the menu.",
  "体験後に残った言葉。": "Words left after the experience.",
  "青春恋愛 / 郷愁": "Youth Romance / Nostalgia",
  "32歳・会社員": "32 / Office worker",
  "人生分岐 / 安堵": "Life Branch / Relief",
  "44歳・経営者": "44 / Executive",
  "旅行 / 解放感": "Travel / Release",
  "41歳・医師": "41 / Doctor",
  "成功 / 判断": "Success / Judgment",
  "38歳・事業責任者": "38 / Business lead",
  "敗北 / 奥行き": "Defeat / Depth",
  "29歳・コンサルタント": "29 / Consultant",
  "アイデンティティ / 視点変化": "Identity / Perspective shift",
  "35歳・デザイナー": "35 / Designer",
  "人生分岐 / 再肯定": "Life Branch / Reaffirmation",
  "47歳・教師": "47 / Teacher",
  "才能 / 再開": "Talent / Restart",
  "26歳・販売員": "26 / Sales associate",
  "失恋 / 自己受容": "Heartbreak / Self-acceptance",
  "52歳・公務員": "52 / Civil servant",
  "Achievement / 2日から": "Achievement / from 2 days",
  "Travel Archive / 9日から": "Travel Archive / from 9 days",
  "Identity Template / 30日から": "Identity Template / from 30 days",
  "Failure Memory / 6時間から": "Failure Memory / from 6 hours",
  "CEOとして決断した日、国体決勝で名前を呼ばれた瞬間、作品が初めて評価された夜。勝った結果だけでなく、そこまでの緊張も含めて残します。":
    "The day you made a CEO decision, the moment your name was called in a national final, the night your work was first recognized. It preserves not only the winning result, but the tension that led there.",
  "学生最後のヨーロッパ周遊": "A final student trip around Europe",
  "男性として、女性として、親として、子として、ヒーローとして、ヒロインとして。現実の自己を壊さず、別の視点で人生を眺めるための大きな記憶テンプレートです。":
    "As a man, woman, parent, child, hero, or heroine. A large memory template for viewing life from another perspective without breaking the real self.",
  "県大会で負けた帰りのバス、失恋した駅のホーム、事業に失敗して謝罪に向かう朝。傷つくためではなく、他人の痛みを想像できる人生にするための記憶です。":
    "The bus ride home after losing a prefectural tournament, a station platform after heartbreak, a morning heading to apologize after a failed business. These memories are not for being hurt, but for imagining others' pain.",
  "幸せな記憶を足すことも、失敗の記憶を足すことも、どちらも人生を豊かにする選択です。Neuramnesia では購入前に感情強度と境界タグを調整し、現実の自分を保ったまま「経験したかった人生」を持ち帰れるように設計します。":
    "Adding happy memories and adding memories of failure are both choices that enrich life. Neuramnesia adjusts emotional intensity and boundary tags before purchase so you can bring home the life you wanted to experience while preserving your real self.",
  "記憶体験が不安に見える理由は、仕組みよりも場面が見えないことにあります。Neuramnesia の施設ページでは、来館から覚醒後のケアまでを、身体感覚が想像できる粒度で案内します。":
    "Memory experiences can feel unsettling because the setting is invisible, more than because of the mechanism. The facility page explains everything from arrival to aftercare at a level where bodily sensations can be imagined.",
  "記憶はそのまま販売されません。個人情報や第三者情報を除去し、没入度・感情強度・現実混同リスクを評価したうえで、体験商品として再構成されます。":
    "Memories are not sold as-is. Personal and third-party information is removed, immersion, emotional intensity, and reality-confusion risk are evaluated, and the memory is reconstructed as an experience product.",
  "すべての記憶には、没入度・感情強度・現実混同リスクのレーティングが付与されます。":
    "Every memory receives ratings for immersion, emotional intensity, and reality-confusion risk.",
  "記憶の購入はオンラインで完結しますが、記憶の定着は実店舗で行います。日時を予約いただければ、記憶の選択は来館時でも可能です。":
    "Purchasing a memory is completed online, but fixation takes place at a physical facility. Once you reserve a time, memory selection can also happen onsite.",
  "このLPでは、まず記憶体験の世界観を紹介します。具体的なスポーツ選手、アーティスト、ヒーロー、異世界転生などの購入メニューは、専用カタログで選べます。":
    "This landing page introduces the world of memory experiences. Specific purchase menus such as athlete, artist, hero, and isekai lives can be selected in the catalog.",
  "他人の記憶を覗くのではなく、あなたの中に「体験済みの過去」として残す。NEURAMNESIA Catalog では、そのための人生テンプレートを購買導線として整理しています。":
    "Rather than peeking into someone else's memory, it remains inside you as an experienced past. The NEURAMNESIA Catalog organizes life templates for that purchase journey.",
  "購入者が持ち帰ったのは、派手な夢ではなく、日常の見え方を少し変える記憶でした。":
    "What buyers took home was not a flashy dream, but a memory that slightly changed how everyday life looks.",
  "“放課後の教室で告白した記憶を買いました。現実の高校時代は何もなかったのに、駅のホームで夕方の匂いがすると、ちゃんと好きだった人がいた気がします。”":
    "\"I bought the memory of confessing in an after-school classroom. Nothing happened in my real high-school years, but when I smell evening air on a station platform, I feel like I really had someone I loved.\"",
  "“結婚しなかった人生を選んだことに後悔はないと思っていました。でも、結婚式の朝の記憶を体験したら、後悔というより、別の私にも幸せがあったんだと納得できました。”":
    "\"I thought I had no regrets about not marrying. But after experiencing the memory of a wedding morning, I felt not regret, but acceptance that another version of me also had happiness.\"",
  "“旅行に行く時間がないまま40代になりました。ヨーロッパを一人で回った9日間の記憶を買ってから、仕事帰りに知らない路地へ入るのが少し怖くなくなりました。”":
    "\"I reached my forties without time to travel. After buying nine days of solo travel through Europe, I became a little less afraid of entering unknown alleys after work.\"",
  "“CEO体験を購入してから、会議室の景色が少し違って見えるようになりました。成功した自分を信じるというより、大きな決断の前に黙る時間を覚えた感じです。”":
    "\"After buying the CEO experience, meeting rooms started to look a little different. It is less about believing in a successful self and more about remembering the silence before a big decision.\"",
  "“県大会で負けた帰りのバスを体験しました。私は挫折らしい挫折を避けてきたので、悔しくて黙っている十代の自分が、妙に大人に見えました。”":
    "\"I experienced the bus ride home after losing a prefectural tournament. I had avoided real setbacks, so my silent, frustrated teenage self looked strangely grown-up.\"",
  "“別の性別で成人式を迎える記憶は、思っていたより派手ではありませんでした。髪を整え、名前を呼ばれ、家族に写真を撮られる。それだけなのに、世界の見え方が半歩ずれました。”":
    "\"The memory of coming of age in another gender was less dramatic than I expected. Fixing my hair, hearing my name, being photographed by family. That alone shifted the world half a step.\"",
  "“独身のまま海外赴任した5年間を入れました。家族を選んだ今の人生を否定するためではなく、選ばなかった静けさにも触れたかった。体験後、今の家の騒がしさが前より愛おしいです。”":
    "\"I added five years of staying single and working overseas. Not to deny the family life I chose, but to touch the quiet I did not choose. Afterward, the noise at home feels more precious.\"",
  "“初個展で一枚だけ作品が売れる記憶を買いました。大成功ではなく、一人だけが本気で見てくれたという小ささがよかった。帰ってから、しまっていた画材を出しました。”":
    "\"I bought the memory of selling just one piece at my first solo show. Not a huge success, but the smallness of one person truly seeing it was good. I took out my old art supplies afterward.\"",
  "“失恋版を選んだのに、体験後に残ったのは惨めさではありませんでした。選ばれなかった自分にも、あの夕方を最後まで歩いた尊さがあると思えました。”":
    "\"I chose the heartbreak version, but what remained afterward was not misery. I could feel dignity in the self who was not chosen and still walked through that evening.\"",
  "放課後の教室で告白した記憶を買いました。現実の高校時代は何もなかったのに、駅のホームで夕方の匂いがすると、ちゃんと好きだった人がいた気がします。":
    "I bought the memory of confessing in an after-school classroom. Nothing happened in my real high-school years, but when I smell evening air on a station platform, I feel like I really had someone I loved.",
  "結婚しなかった人生を選んだことに後悔はないと思っていました。でも、結婚式の朝の記憶を体験したら、後悔というより、別の私にも幸せがあったんだと納得できました。":
    "I thought I had no regrets about not marrying. But after experiencing the memory of a wedding morning, I felt not regret, but acceptance that another version of me also had happiness.",
  "旅行に行く時間がないまま40代になりました。ヨーロッパを一人で回った9日間の記憶を買ってから、仕事帰りに知らない路地へ入るのが少し怖くなくなりました。":
    "I reached my forties without time to travel. After buying nine days of solo travel through Europe, I became a little less afraid of entering unknown alleys after work.",
  "CEO体験を購入してから、会議室の景色が少し違って見えるようになりました。成功した自分を信じるというより、大きな決断の前に黙る時間を覚えた感じです。":
    "After buying the CEO experience, meeting rooms started to look a little different. It is less about believing in a successful self and more about remembering the silence before a big decision.",
  "県大会で負けた帰りのバスを体験しました。私は挫折らしい挫折を避けてきたので、悔しくて黙っている十代の自分が、妙に大人に見えました。":
    "I experienced the bus ride home after losing a prefectural tournament. I had avoided real setbacks, so my silent, frustrated teenage self looked strangely grown-up.",
  "別の性別で成人式を迎える記憶は、思っていたより派手ではありませんでした。髪を整え、名前を呼ばれ、家族に写真を撮られる。それだけなのに、世界の見え方が半歩ずれました。":
    "The memory of coming of age in another gender was less dramatic than I expected. Fixing my hair, hearing my name, being photographed by family. That alone shifted the world half a step.",
  "独身のまま海外赴任した5年間を入れました。家族を選んだ今の人生を否定するためではなく、選ばなかった静けさにも触れたかった。体験後、今の家の騒がしさが前より愛おしいです。":
    "I added five years of staying single and working overseas. Not to deny the family life I chose, but to touch the quiet I did not choose. Afterward, the noise at home feels more precious.",
  "初個展で一枚だけ作品が売れる記憶を買いました。大成功ではなく、一人だけが本気で見てくれたという小ささがよかった。帰ってから、しまっていた画材を出しました。":
    "I bought the memory of selling just one piece at my first solo show. Not a huge success, but the smallness of one person truly seeing it was good. I took out my old art supplies afterward.",
  "失恋版を選んだのに、体験後に残ったのは惨めさではありませんでした。選ばれなかった自分にも、あの夕方を最後まで歩いた尊さがあると思えました。":
    "I chose the heartbreak version, but what remained afterward was not misery. I could feel dignity in the self who was not chosen and still walked through that evening.",
  "こめかみ、後頭部、額に柔らかいセンサーを当てます。髪を剃る必要はなく、微弱な冷感と軽い圧だけが残ります。":
    "Soft sensors are placed on the temples, back of the head, and forehead. No shaving is needed; only a faint coolness and light pressure remain.",
  "意識は浅い睡眠に近く、音は遠く聞こえます。映像を見るというより、匂い、重さ、声、気まずさ、嬉しさが順番に自分の経験として結びつきます。":
    "Consciousness is close to light sleep, and sounds feel distant. Rather than watching images, smells, weight, voices, awkwardness, and joy connect in sequence as your own experience.",
  "神経": "neuro",
  "記憶喪失": "amnesia",
  "Neuro（神経）": "Neuro",
  "Amnesia（記憶喪失）": "Amnesia",
  "NEURAMNESIA は、": "NEURAMNESIA is a coined word combining ",
  "を組み合わせた造語です。": "combined as a coined word.",
  "青春 / 恋愛": "Youth / Romance",
  "文化祭の片付け後、夕方の教室で好きだった人と二人だけになる青春恋愛記憶。":
    "A youth romance memory of being alone in an evening classroom with the person you liked after cleaning up a school festival.",
  "記憶内期間: 3時間": "Memory span: 3 hours",
  "感情強度: 86": "Emotional intensity: 86",
  "匿名化済み実体験": "Anonymized real experience",
  "部活 / 挫折": "Club Activity / Setback",
  "レギュラーになれなかったまま、仲間の打席を見つめる高校野球の挫折と誇り。":
    "A high-school baseball memory of pride and frustration while watching a teammate bat after never becoming a starter.",
  "記憶内期間: 9日間": "Memory span: 9 days",
  "感情強度: 91": "Emotional intensity: 91",
  "スポーツ / 達成": "Sports / Achievement",
  "地元代表としてコートに立ち、観客席の家族を見つける数秒を中心に構成した競技記憶。":
    "A sports memory built around the few seconds of standing on the court as a local representative and finding family in the stands.",
  "記憶内期間: 2日間": "Memory span: 2 days",
  "感情強度: 88": "Emotional intensity: 88",
  "ハイブリッド": "Hybrid",
  "スポーツ / 余韻": "Sports / Afterglow",
  "大舞台の熱狂が終わった翌朝、メダルよりも静けさが残るアスリートの余韻。":
    "The afterglow of an athlete on the morning after the frenzy of the big stage, when quiet remains more than the medal.",
  "記憶内期間: 36時間": "Memory span: 36 hours",
  "感情強度: 79": "Emotional intensity: 79",
  "幼少期 / 原風景": "Childhood / Original Scene",
  "小さな靴、夕方の匂い、初めて一人で門を出た幼少期の自立記憶。":
    "A childhood independence memory of small shoes, evening smells, and leaving the gate alone for the first time.",
  "記憶内期間: 40分": "Memory span: 40 minutes",
  "感情強度: 64": "Emotional intensity: 64",
  "学生 / 才能": "Student / Talent",
  "自分でも知らなかった才能を、先生の一言で信じかける学生時代の創作記憶。":
    "A student creative memory where a teacher's words make you almost believe in a talent you did not know you had.",
  "記憶内期間: 1週間": "Memory span: 1 week",
  "感情強度: 72": "Emotional intensity: 72",
  "青春 / 舞台": "Youth / Stage",
  "練習の失敗、舞台袖の暗さ、本番で名前を呼ばれるまでの短い演劇記憶。":
    "A short theater memory of failed practice, the darkness backstage, and waiting for your name to be called.",
  "記憶内期間: 14日間": "Memory span: 14 days",
  "感情強度: 83": "Emotional intensity: 83",
  "人工生成": "Artificially generated",
  "部活 / 敗北": "Club Activity / Defeat",
  "誰も話さない車内、窓に映る自分の顔、悔しさが少しだけ未来に変わる記憶。":
    "A memory of a silent bus, your face in the window, and frustration turning slightly toward the future.",
  "記憶内期間: 6時間": "Memory span: 6 hours",
  "感情強度: 90": "Emotional intensity: 90",
  "プロ契約、代表選考、決勝戦、引退試合まで。身体感覚と歓声を中心に構成された競技人生テンプレート。":
    "A competitive life template from pro contract and national selection to finals and retirement, built around bodily sensation and cheers.",
  "初舞台、創作の孤独、世界ツアー、観客の熱狂。才能を持って生きた記憶の連続体験。":
    "A continuous memory experience of living with talent: first stage, creative solitude, world tours, and audience heat.",
  "料理人、建築家、研究者、職人、交渉人。熟練した手つきや判断力だけを安全に抽出したキャリア記憶。":
    "Career memories of chefs, architects, researchers, artisans, and negotiators, safely extracting skilled hands and judgment.",
  "都市の危機、正体を隠す日常、誰かを救う瞬間。現実には存在しない英雄譚を記憶として残します。":
    "Urban crisis, a hidden identity, and the moment of saving someone. A heroic tale that never existed becomes memory.",
  "陰謀、友情、選択、覚醒。物語の中心に立つ人生を、過度な恐怖ではなく静かな没入感で設計します。":
    "Conspiracy, friendship, choice, awakening. A life at the center of a story, designed for quiet immersion rather than excessive fear.",
  "第二の名前、知らない言語、選ばれた役割。現実と混同しない境界タグ付きのファンタジー記憶。":
    "A fantasy memory with a second name, unknown language, and chosen role, marked with boundary tags to avoid reality confusion.",
  "初恋、告白、失恋、再会など、感情強度の高い記憶。": "High-emotion memories such as first love, confession, heartbreak, and reunion.",
  "遭難、災害、極限状態からの生還など、危険度の高い体験。": "High-risk experiences such as survival from accidents, disasters, and extreme states.",
  "一流職人、外科医、音楽家、アスリートなどの熟練体験。": "Mastery experiences from elite artisans, surgeons, musicians, athletes, and more.",
  "経営判断、交渉、勝負の瞬間など、責任ある立場の記憶。": "Memories of responsibility, such as executive decisions, negotiations, and decisive moments.",
  "普通の観光では得られない、個人的で濃密な旅の記憶。": "Personal, dense travel memories that ordinary tourism cannot provide.",
  "別れ、喪失、卒業、人生の転機に関する記憶。": "Memories of farewell, loss, graduation, and life turning points.",
  "よくある質問。": "Frequently Asked Questions.",
  "これは夢ですか？": "Is this a dream?",
  "記憶は消せますか？": "Can memories be erased?",
  "本当に安全ですか？": "Is it really safe?",
  "現実と混同しませんか？": "Will I confuse it with reality?",
  "購入した記憶と現実の記憶を入れ替えることはできますか？": "Can I replace real memories with purchased memories?",
  "体験後に副作用はありますか？": "Are there side effects after the experience?",
  "自分の記憶を売ると、その記憶は失われますか？": "If I sell my memory, will I lose it?",
  "売却した記憶に他人がアクセスするのですか？": "Will other people access the memory I sell?",
  "第三者が登場する記憶はどう処理されますか？": "How are memories involving third parties handled?",
  "トラウマ記憶も販売できますか？": "Can trauma memories be sold?",
  "独占ライセンスとは何ですか？": "What is an exclusive license?",
  "（架空）": "(fictional)",
  "覚醒と現実復帰": "Awakening and return to reality",
  "NEURAMNESIA は、Neuro（神経）とAmnesia（記憶喪失）を組み合わせた造語です。":
    "NEURAMNESIA is a coined word combining Neuro and Amnesia.",
  "スポーツ選手の人生": "Life as an Athlete",
  "アーティストの人生": "Life as an Artist",
  "職業マスタリー": "Professional Mastery",
  "仮想ヒーロー": "Virtual Hero",
  "仮想ヒロイン": "Virtual Heroine",
  "異世界転生": "Isekai Rebirth",
  "放課後、誰にも言えなかった告白": "The After-school Confession You Never Said",
  "最後の夏、ベンチから見た甲子園": "The Final Summer, Watching Koshien from the Bench",
  "国体決勝、名前を呼ばれる瞬間": "The Moment Your Name Is Called in the National Final",
  "オリンピックのあと、空港で一人になる": "Alone at the Airport After the Olympics",
  "幼稚園の帰り道、手を離した日": "The Day You Let Go on the Walk Home from Kindergarten",
  "美術室で褒められた一枚": "The Drawing Praised in the Art Room",
  "初めて主役を任された文化祭": "The School Festival Where You First Took the Lead",
  "県大会で負けた帰りのバス": "The Bus Ride Home After Losing the Prefectural Tournament",
  "Catalog": "Catalog",
  "Purchase Motives": "Purchase Motives",
  "Experience Layer": "Experience Layer",
  "Facility Preview": "Facility Preview",
  "Memory Marketplace": "Memory Marketplace",
  "Catalog Preview": "Catalog Preview",
  "Testimonials": "Testimonials",
  "Begin Again": "Begin Again",
  "記憶を購入する": "Buy a Memory",
  "人生メニューを見る": "View Life Menus",
  "施設と体験の流れを見る": "View Facility and Flow",
  "安全基準を見る": "View Safety Standards",
  "テンプレートを見る": "View Template",
  "体験内容を確認する": "Review Experience",
  "人生メニューのカテゴリ。": "Life menu categories.",
  "言語": "Language",
  "フッターナビゲーション": "Footer navigation",
  "日本語": "Japanese",
  "英語": "English",
};

const I18nContext = createContext<I18nContextValue | null>(null);
const textNodeOriginals = new WeakMap<Text, string>();

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function translateText(text: string, language: Language) {
  if (language === "ja") return text;
  const exact = translations[text];
  if (exact) return exact;
  const normalized = normalizeText(text);
  return translations[normalized] || text;
}

function translateDom(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return /[一-龥ぁ-んァ-ヶ]/.test(node.textContent || "") || textNodeOriginals.has(node as Text)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const original = textNodeOriginals.get(node) || node.textContent || "";
    if (!textNodeOriginals.has(node)) {
      textNodeOriginals.set(node, original);
    }
    if (language === "ja") {
      node.textContent = original;
      return;
    }
    const translated = translateText(original, language);
    const prefix = original.match(/^\s*/)?.[0] || "";
    const suffix = original.match(/\s*$/)?.[0] || "";
    node.textContent = `${prefix}${translated}${suffix}`;
  });

  const attrSelector = "[placeholder],[aria-label],option";
  root.querySelectorAll?.(attrSelector).forEach((element) => {
    ["placeholder", "aria-label"].forEach((attr) => {
      const current = element.getAttribute(attr);
      const originalAttr = `data-i18n-original-${attr}`;
      if (!current && !element.hasAttribute(originalAttr)) return;
      const original = element.getAttribute(originalAttr) || current || "";
      if (!element.hasAttribute(originalAttr)) {
        element.setAttribute(originalAttr, original);
      }
      element.setAttribute(attr, translateText(original, language));
    });

    if (element.tagName === "OPTION") {
      const option = element as HTMLOptionElement;
      const original = option.dataset.i18nOriginalText || option.textContent || "";
      option.dataset.i18nOriginalText = original;
      option.textContent = translateText(original, language);
    }
  });
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ja";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ja" || stored === "en") return stored;
  return window.navigator.language.toLowerCase().startsWith("en") ? "en" : "ja";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    window.setTimeout(() => translateDom(document.body, language), 0);
    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      if (scheduled) return;
      if (!mutations.some((mutation) => mutation.addedNodes.length > 0)) return;
      scheduled = true;
      window.setTimeout(() => {
        scheduled = false;
        translateDom(document.body, language);
      }, 0);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (text: string) => (language === "en" ? translations[text] || text : text),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
