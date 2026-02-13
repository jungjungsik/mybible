export interface DailyVerseEntry {
  book: string;
  chapter: number;
  verse: number;
  preview: string;
}

const FAMOUS_VERSES: DailyVerseEntry[] = [
  // ── 시편 (Psalms) ──
  { book: 'PSA', chapter: 23, verse: 1, preview: '여호와는 나의 목자시니 내가 부족함이 없으리로다' },
  { book: 'PSA', chapter: 23, verse: 4, preview: '내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라' },
  { book: 'PSA', chapter: 27, verse: 1, preview: '여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요' },
  { book: 'PSA', chapter: 37, verse: 4, preview: '또 여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다' },
  { book: 'PSA', chapter: 46, verse: 1, preview: '하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라' },
  { book: 'PSA', chapter: 46, verse: 10, preview: '이르시되 너희는 가만히 있어 내가 하나님 됨을 알지어다' },
  { book: 'PSA', chapter: 51, verse: 10, preview: '하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서' },
  { book: 'PSA', chapter: 91, verse: 1, preview: '지존자의 은밀한 곳에 거주하는 자는 전능자의 그늘 아래에 살리로다' },
  { book: 'PSA', chapter: 91, verse: 2, preview: '나는 여호와를 가리켜 말하기를 그는 나의 피난처요 나의 요새요 나의 하나님이시라' },
  { book: 'PSA', chapter: 100, verse: 3, preview: '여호와가 우리 하나님이신 줄 너희는 알지어다 그는 우리를 지으신 이요' },
  { book: 'PSA', chapter: 103, verse: 1, preview: '내 영혼아 여호와를 송축하라 내 속에 있는 것들아 다 그의 거룩한 이름을 송축하라' },
  { book: 'PSA', chapter: 119, verse: 105, preview: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다' },
  { book: 'PSA', chapter: 121, verse: 1, preview: '내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올까' },
  { book: 'PSA', chapter: 139, verse: 14, preview: '내가 주께 감사하옴은 나를 지으심이 심히 기묘하심이라' },
  { book: 'PSA', chapter: 150, verse: 6, preview: '호흡이 있는 자마다 여호와를 찬양할지어다 할렐루야' },

  // ── 잠언 (Proverbs) ──
  { book: 'PRO', chapter: 3, verse: 5, preview: '너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라' },
  { book: 'PRO', chapter: 3, verse: 6, preview: '너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라' },
  { book: 'PRO', chapter: 4, verse: 23, preview: '모든 지킬 만한 것 중에 더욱 네 마음을 지키라 생명의 근원이 이에서 남이니라' },
  { book: 'PRO', chapter: 16, verse: 3, preview: '너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라' },
  { book: 'PRO', chapter: 18, verse: 10, preview: '여호와의 이름은 견고한 망대라 의인은 그리로 달려가서 안전함을 얻느니라' },
  { book: 'PRO', chapter: 22, verse: 6, preview: '마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라' },

  // ── 이사야 (Isaiah) ──
  { book: 'ISA', chapter: 40, verse: 31, preview: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요' },
  { book: 'ISA', chapter: 41, verse: 10, preview: '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라' },
  { book: 'ISA', chapter: 43, verse: 1, preview: '야곱아 너를 창조하신 여호와께서 지금 말씀하시느니라 이스라엘아 너를 지으신 이가 말씀하시느니라 두려워하지 말라' },
  { book: 'ISA', chapter: 43, verse: 2, preview: '네가 물 가운데로 지날 때에 내가 너와 함께 할 것이라' },
  { book: 'ISA', chapter: 53, verse: 5, preview: '그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라' },
  { book: 'ISA', chapter: 55, verse: 8, preview: '이는 내 생각이 너희의 생각과 다르며 내 길은 너희의 길과 다름이니라' },
  { book: 'ISA', chapter: 55, verse: 11, preview: '내 입에서 나가는 말도 이와 같이 헛되이 내게로 되돌아오지 아니하고' },

  // ── 예레미야 (Jeremiah) ──
  { book: 'JER', chapter: 29, verse: 11, preview: '너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라' },
  { book: 'JER', chapter: 33, verse: 3, preview: '너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라' },
  { book: 'JER', chapter: 1, verse: 5, preview: '내가 너를 모태에 짓기 전에 너를 알았고 네가 배에서 나오기 전에 너를 성별하였고' },

  // ── 창세기 (Genesis) ──
  { book: 'GEN', chapter: 1, verse: 1, preview: '태초에 하나님이 천지를 창조하시니라' },
  { book: 'GEN', chapter: 1, verse: 27, preview: '하나님이 자기 형상 곧 하나님의 형상대로 사람을 창조하시되 남자와 여자를 창조하시고' },

  // ── 여호수아 (Joshua) ──
  { book: 'JOS', chapter: 1, verse: 9, preview: '내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라' },

  // ── 마태복음 (Matthew) ──
  { book: 'MAT', chapter: 5, verse: 14, preview: '너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요' },
  { book: 'MAT', chapter: 5, verse: 16, preview: '이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라' },
  { book: 'MAT', chapter: 6, verse: 33, preview: '너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라' },
  { book: 'MAT', chapter: 6, verse: 34, preview: '내일 일을 위하여 염려하지 말라 내일 일은 내일이 염려할 것이요' },
  { book: 'MAT', chapter: 7, verse: 7, preview: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니' },
  { book: 'MAT', chapter: 11, verse: 28, preview: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라' },
  { book: 'MAT', chapter: 11, verse: 29, preview: '나는 마음이 온유하고 겸손하니 나의 멍에를 메고 내게 배우라 그리하면 너희 마음이 쉼을 얻으리니' },
  { book: 'MAT', chapter: 28, verse: 19, preview: '그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고' },
  { book: 'MAT', chapter: 28, verse: 20, preview: '내가 세상 끝날까지 너희와 항상 함께 있으리라 하시니라' },

  // ── 요한복음 (John) ──
  { book: 'JHN', chapter: 1, verse: 1, preview: '태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라' },
  { book: 'JHN', chapter: 1, verse: 12, preview: '영접하는 자 곧 그 이름을 믿는 자들에게는 하나님의 자녀가 되는 권세를 주셨으니' },
  { book: 'JHN', chapter: 3, verse: 16, preview: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라' },
  { book: 'JHN', chapter: 8, verse: 32, preview: '진리를 알지니 진리가 너희를 자유롭게 하리라' },
  { book: 'JHN', chapter: 10, verse: 10, preview: '내가 온 것은 양으로 생명을 얻게 하고 더 풍성히 얻게 하려는 것이라' },
  { book: 'JHN', chapter: 11, verse: 25, preview: '나는 부활이요 생명이니 나를 믿는 자는 죽어도 살겠고' },
  { book: 'JHN', chapter: 13, verse: 34, preview: '새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라' },
  { book: 'JHN', chapter: 14, verse: 6, preview: '예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라' },
  { book: 'JHN', chapter: 14, verse: 27, preview: '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라' },
  { book: 'JHN', chapter: 15, verse: 5, preview: '나는 포도나무요 너희는 가지라 그가 내 안에 내가 그 안에 거하면 사람이 열매를 많이 맺나니' },
  { book: 'JHN', chapter: 15, verse: 7, preview: '너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는 대로 구하라 그리하면 이루리라' },
  { book: 'JHN', chapter: 16, verse: 33, preview: '이것을 너희에게 이르는 것은 너희로 내 안에서 평안을 누리게 하려 함이라 세상에서는 너희가 환난을 당하나 담대하라 내가 세상을 이기었노라' },

  // ── 로마서 (Romans) ──
  { book: 'ROM', chapter: 5, verse: 8, preview: '우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라' },
  { book: 'ROM', chapter: 8, verse: 1, preview: '그러므로 이제 그리스도 예수 안에 있는 자에게는 결코 정죄함이 없나니' },
  { book: 'ROM', chapter: 8, verse: 28, preview: '우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라' },
  { book: 'ROM', chapter: 8, verse: 31, preview: '만일 하나님이 우리를 위하시면 누가 우리를 대적하리요' },
  { book: 'ROM', chapter: 8, verse: 37, preview: '이 모든 일에 우리를 사랑하시는 이로 말미암아 우리가 넉넉히 이기느니라' },
  { book: 'ROM', chapter: 8, verse: 38, preview: '내가 확신하노니 사망이나 생명이나 천사들이나 권세자들이나 현재 일이나 장래 일이나 능력이나' },
  { book: 'ROM', chapter: 10, verse: 9, preview: '네가 만일 네 입으로 예수를 주로 시인하며 또 하나님께서 그를 죽은 자 가운데서 살리신 것을 네 마음에 믿으면 구원을 받으리라' },
  { book: 'ROM', chapter: 12, verse: 1, preview: '그러므로 형제들아 내가 하나님의 모든 자비하심으로 너희를 권하노니 너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라' },
  { book: 'ROM', chapter: 12, verse: 2, preview: '너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하도록 하라' },

  // ── 고린도전서 (1 Corinthians) ──
  { book: '1CO', chapter: 10, verse: 13, preview: '사람이 감당할 시험 밖에는 너희가 당한 것이 없나니 오직 하나님은 미쁘사 너희가 감당하지 못할 시험 당함을 허락하지 아니하시고' },
  { book: '1CO', chapter: 13, verse: 4, preview: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며' },
  { book: '1CO', chapter: 13, verse: 13, preview: '그런즉 믿음 소망 사랑 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라' },

  // ── 고린도후서 (2 Corinthians) ──
  { book: '2CO', chapter: 5, verse: 17, preview: '그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다' },
  { book: '2CO', chapter: 12, verse: 9, preview: '내 은혜가 네게 족하도다 이는 내 능력이 약한 데서 온전하여짐이라' },

  // ── 갈라디아서 (Galatians) ──
  { book: 'GAL', chapter: 2, verse: 20, preview: '내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라' },
  { book: 'GAL', chapter: 5, verse: 22, preview: '오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과' },
  { book: 'GAL', chapter: 6, verse: 9, preview: '우리가 선을 행하되 낙심하지 말지니 포기하지 아니하면 때가 이르매 거두리라' },

  // ── 에베소서 (Ephesians) ──
  { book: 'EPH', chapter: 2, verse: 8, preview: '너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라' },
  { book: 'EPH', chapter: 3, verse: 20, preview: '우리 가운데서 역사하시는 능력대로 우리가 구하거나 생각하는 모든 것에 더 넘치도록 능히 하실 이에게' },
  { book: 'EPH', chapter: 6, verse: 10, preview: '끝으로 너희가 주 안에서와 그 힘의 능력으로 강건하여지고' },

  // ── 빌립보서 (Philippians) ──
  { book: 'PHP', chapter: 2, verse: 3, preview: '아무 일에든지 다툼이나 허영으로 하지 말고 오직 겸손한 마음으로 각각 자기보다 남을 낫게 여기고' },
  { book: 'PHP', chapter: 4, verse: 4, preview: '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라' },
  { book: 'PHP', chapter: 4, verse: 6, preview: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라' },
  { book: 'PHP', chapter: 4, verse: 7, preview: '그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라' },
  { book: 'PHP', chapter: 4, verse: 13, preview: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라' },

  // ── 골로새서 (Colossians) ──
  { book: 'COL', chapter: 3, verse: 23, preview: '무슨 일을 하든지 마음을 다하여 주께 하듯 하고 사람에게 하듯 하지 말라' },

  // ── 데살로니가전서 (1 Thessalonians) ──
  { book: '1TH', chapter: 5, verse: 16, preview: '항상 기뻐하라' },
  { book: '1TH', chapter: 5, verse: 17, preview: '쉬지 말고 기도하라' },
  { book: '1TH', chapter: 5, verse: 18, preview: '범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라' },

  // ── 디모데후서 (2 Timothy) ──
  { book: '2TI', chapter: 1, verse: 7, preview: '하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니' },
  { book: '2TI', chapter: 3, verse: 16, preview: '모든 성경은 하나님의 감동으로 된 것으로 교훈과 책망과 바르게 함과 의로 교육하기에 유익하니' },

  // ── 히브리서 (Hebrews) ──
  { book: 'HEB', chapter: 4, verse: 12, preview: '하나님의 말씀은 살아 있고 활력이 있어 좌우에 날선 어떤 검보다도 예리하여' },
  { book: 'HEB', chapter: 11, verse: 1, preview: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니' },
  { book: 'HEB', chapter: 12, verse: 1, preview: '이러므로 우리에게 구름 같이 둘러싼 허다한 증인들이 있으니 모든 무거운 것과 얽매이기 쉬운 죄를 벗어 버리고' },
  { book: 'HEB', chapter: 12, verse: 2, preview: '믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자' },
  { book: 'HEB', chapter: 13, verse: 5, preview: '돈을 사랑하지 말고 있는 바를 족한 줄로 알라 그가 친히 말씀하시기를 내가 결코 너희를 버리지 아니하고 너희를 떠나지 아니하리라 하셨느니라' },
  { book: 'HEB', chapter: 13, verse: 8, preview: '예수 그리스도는 어제나 오늘이나 영원토록 동일하시니라' },

  // ── 야고보서 (James) ──
  { book: 'JAS', chapter: 1, verse: 2, preview: '내 형제들아 너희가 여러 가지 시험을 당하거든 온전히 기쁘게 여기라' },
  { book: 'JAS', chapter: 1, verse: 5, preview: '너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라' },
  { book: 'JAS', chapter: 4, verse: 8, preview: '하나님을 가까이하라 그리하면 너희를 가까이하시리라' },

  // ── 베드로전서 (1 Peter) ──
  { book: '1PE', chapter: 5, verse: 7, preview: '너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라' },

  // ── 요한일서 (1 John) ──
  { book: '1JN', chapter: 1, verse: 9, preview: '만일 우리가 우리 죄를 자백하면 그는 미쁘시고 의로우사 우리 죄를 사하시며 우리를 모든 불의에서 깨끗하게 하실 것이요' },
  { book: '1JN', chapter: 4, verse: 8, preview: '사랑하지 아니하는 자는 하나님을 알지 못하나니 이는 하나님은 사랑이심이라' },
  { book: '1JN', chapter: 4, verse: 18, preview: '사랑 안에 두려움이 없고 온전한 사랑이 두려움을 내쫓나니' },
  { book: '1JN', chapter: 4, verse: 19, preview: '우리가 사랑함은 그가 먼저 우리를 사랑하셨음이라' },

  // ── 요한계시록 (Revelation) ──
  { book: 'REV', chapter: 3, verse: 20, preview: '볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라' },
  { book: 'REV', chapter: 21, verse: 4, preview: '모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니' },
  { book: 'REV', chapter: 22, verse: 13, preview: '나는 알파와 오메가요 처음과 마지막이요 시작과 마침이라' },

  // ── 미가 (Micah) ──
  { book: 'MIC', chapter: 6, verse: 8, preview: '사람아 주께서 선한 것이 무엇임을 네게 보이셨나니 여호와께서 네게 구하시는 것은 오직 정의를 행하며 인자를 사랑하며 겸손하게 네 하나님과 함께 행하는 것이 아니냐' },

  // ── 다니엘 (Daniel) ──
  { book: 'DAN', chapter: 3, verse: 17, preview: '만일 그럴 것이면 우리가 섬기는 하나님이 우리를 풀무불 가운데에서 능히 건져내시겠고' },

  // ── 느헤미야 (Nehemiah) ──
  { book: 'NEH', chapter: 8, verse: 10, preview: '여호와를 기뻐하는 것이 너희의 힘이니라' },

  // ── 누가복음 (Luke) ──
  { book: 'LUK', chapter: 1, verse: 37, preview: '대저 하나님의 모든 말씀은 능하지 못하심이 없느니라' },
  { book: 'LUK', chapter: 6, verse: 38, preview: '주라 그리하면 너희에게 줄 것이니 곧 후히 되어 누르고 흔들어 넘치도록 하여 너희에게 안겨 주리라' },
  { book: 'LUK', chapter: 11, verse: 9, preview: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요' },

  // ── 마가복음 (Mark) ──
  { book: 'MRK', chapter: 10, verse: 27, preview: '사람으로는 할 수 없으되 하나님으로는 그렇지 아니하니 하나님은 다 하실 수 있느니라' },
  { book: 'MRK', chapter: 11, verse: 24, preview: '무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라' },
];

export function getDailyVerse(): DailyVerseEntry {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % FAMOUS_VERSES.length;
  return FAMOUS_VERSES[index];
}
