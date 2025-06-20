
import type { BlogPost } from '@/types';
import { firestore } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';
import { getAllPosts as getAllPostsAction } from '@/actions/blogActions'; 


const fallbackBlogPosts: BlogPost[] = [
  {
    id: 'sample-post-1',
    title: '타로 카드로 보는 나의 일주일 운세',
    slug: 'weekly-tarot-forecast',
    excerpt: '다가오는 한 주, 타로 카드가 당신에게 어떤 메시지를 전달할까요? 주간 운세를 확인하고 마음의 준비를 하세요.',
    content: `새로운 한 주가 시작되었습니다. 이번 주 당신의 주요 에너지와 조심해야 할 점은 무엇일까요? 간단한 3카드 스프레드를 통해 알아보겠습니다.\n\n**과거: The Hermit (은둔자)**\n지난주는 자기 성찰의 시간이었을 수 있습니다. 혼자만의 시간을 가지며 내면의 목소리에 귀 기울였을 가능성이 큽니다. 이 과정에서 중요한 깨달음을 얻었을 수도 있습니다.\n\n**현재: Two of Cups (컵 2)**\n이번 주에는 중요한 관계에서의 조화와 협력이 강조됩니다. 연인, 친구, 동료와의 관계가 더욱 돈독해지거나 새로운 긍정적인 관계가 시작될 수 있습니다. 마음을 열고 소통하는 것이 중요합니다.\n\n**미래: Ace of Wands (완드 에이스)**\n주 후반이나 다음 주로 이어지는 시기에는 새로운 시작과 창의적인 에너지가 넘칠 것입니다. 새로운 프로젝트를 시작하거나 오랫동안 생각해왔던 아이디어를 실행에 옮기기에 좋은 시기입니다. 열정을 가지고 도전하세요!\n\n**종합 조언:** 과거의 성찰을 바탕으로 현재의 관계를 소중히 하고, 다가올 새로운 기회를 적극적으로 맞이하세요. 당신의 직관과 열정이 길을 안내할 것입니다.`,
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'tarot cards future',
    author: 'InnerSpell 팀',
    tags: ['주간운세', '타로카드', '3카드'],
    date: '2024-03-10',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'sample-post-2',
    title: '메이저 아르카나: "광대" 카드의 깊은 의미',
    slug: 'major-arcana-the-fool',
    excerpt: '메이저 아르카나의 시작을 알리는 0번 카드, "광대"는 무엇을 상징할까요? 순수함과 가능성의 여정을 탐험해봅니다.',
    content: `타로 덱에서 0번 혹은 번호가 없는 카드로 표현되는 "광대(The Fool)"는 메이저 아르카나의 시작이자 끝없는 여정을 상징합니다.\n\n**상징과 이미지:**\n광대 카드는 흔히 절벽 가장자리에 서서 하늘을 바라보는 젊은이로 묘사됩니다. 그의 손에는 작은 보따리가 들려 있고, 발밑에는 작은 개가 그를 따릅니다. 이는 새로운 시작에 대한 순수한 믿음과 약간의 무모함, 그리고 본능적인 충동을 나타냅니다.\n\n**핵심 의미:**\n*   **새로운 시작:** 광대는 미지의 세계로 떠나는 여정의 첫걸음을 의미합니다. 두려움 없이 새로운 경험을 받아들이는 자세입니다.\n*   **순수함과 믿음:** 세상 물정 모르는 순수함, 그리고 모든 것이 잘 될 것이라는 맹목적인 믿음을 상징합니다.\n*   **무한한 가능성:** 아직 아무것도 정해지지 않았기에 모든 것이 가능한 상태입니다.\n*   **자유로운 영혼:** 사회적 규범이나 기대에 얽매이지 않는 자유로운 정신을 나타냅니다.\n\n**정방향 해석:** 새로운 모험, 믿음의 도약, 자발성, 순수함, 잠재력, 열린 마음.\n**역방향 해석:** 무모함, 순진함, 어리석음, 준비 부족, 위험 회피, 중요한 것을 간과함.\n\n광대 카드는 우리에게 때로는 계획과 이성보다는 직관과 믿음을 따르는 용기가 필요함을 알려줍니다. 당신의 삶에서 광대는 어떤 새로운 여정을 제안하고 있나요?`,
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'tarot fool card',
    author: '타로 연구가',
    tags: ['메이저아르카나', '광대카드', '타로해석'],
    date: '2024-03-08',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-08'),
  },
  {
    id: 'sample-post-3',
    title: '타로 명상: 카드를 통해 내면과 연결되기',
    slug: 'tarot-meditation-inner-connection',
    excerpt: '타로 카드를 명상의 도구로 활용하여 더 깊은 자기 이해와 평온을 찾는 방법을 알아보세요.',
    content: `타로 카드는 점술 도구일 뿐만 아니라, 깊은 명상과 자기 성찰을 위한 강력한 매개가 될 수 있습니다.\n\n**타로 명상이란?**\n타로 명상은 특정 타로 카드의 이미지, 상징, 에너지에 집중하여 내면의 지혜와 연결되는 과정입니다. 이를 통해 카드가 가진 다층적인 의미를 개인적인 차원에서 경험하고 통찰을 얻을 수 있습니다.\n\n**타로 명상 방법:**\n1.  **카드 선택:** 현재 자신에게 끌리는 카드, 혹은 특정 질문과 관련된 카드를 한 장 선택합니다.\n2.  **편안한 환경 조성:** 조용하고 방해받지 않는 공간에서 편안한 자세를 취합니다.\n3.  **호흡과 이완:** 깊고 편안한 호흡을 몇 차례 반복하며 몸과 마음의 긴장을 풀어줍니다.\n4.  **카드 응시:** 선택한 카드를 눈높이에 두고 부드럽게 응시합니다. 카드의 전체적인 느낌, 색상, 인물, 상징물 등을 천천히 관찰합니다.\n5.  **이미지 속으로 들어가기:** 눈을 감거나 반쯤 뜨고, 카드 속 풍경이나 인물과 하나가 되는 상상을 합니다. 그곳의 소리, 냄새, 감촉 등을 느껴보세요.\n6.  **메시지 수용:** 카드 속 인물이나 상징이 당신에게 어떤 말을 건네는지, 어떤 느낌이나 생각을 불러일으키는지 가만히 지켜봅니다. 판단하지 않고 모든 것을 수용합니다.\n7.  **기록:** 명상이 끝나면 떠오른 생각, 느낌, 이미지 등을 기록합니다. 이것이 당신의 무의식이 보내는 메시지일 수 있습니다.\n\n**타로 명상의 효과:**\n*   자기 이해 증진\n*   직관력 향상\n*   스트레스 감소 및 정서적 안정\n*   창의적 영감 자극\n*   문제 해결 능력 향상\n\n오늘, 당신의 마음을 끄는 타로 카드 한 장과 함께 내면으로의 여행을 떠나보는 것은 어떨까요?`,
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'meditation tarot peace',
    author: '마음챙김 코치',
    tags: ['타로명상', '마음챙김', '자기성찰', '직관력'],
    date: '2024-03-05',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 'sample-post-4',
    title: '컵 슈트: 감정과 관계의 세계',
    slug: 'cups-suit-emotions-relationships',
    excerpt: '타로의 컵 슈트는 우리의 감정, 관계, 직관, 창의성을 다룹니다. 컵 카드를 통해 마음의 언어를 이해해 보세요.',
    content: `타로의 네 가지 마이너 아르카나 슈트 중 하나인 컵(Cups)은 물의 원소와 연결되어 있으며, 주로 감정, 관계, 사랑, 직관, 창의성, 영성의 영역을 다룹니다.\n\n**컵 슈트의 주요 테마:**\n*   **감정:** 기쁨, 슬픔, 사랑, 두려움 등 인간이 경험하는 다양한 감정의 스펙트럼을 보여줍니다.\n*   **관계:** 연인, 가족, 친구 등 타인과의 관계뿐만 아니라 자기 자신과의 관계도 포함합니다.\n*   **사랑:** 로맨틱한 사랑, 플라토닉한 사랑, 자기애 등 다양한 형태의 사랑을 탐구합니다.\n*   **직관과 무의식:** 논리보다는 직감, 꿈, 무의식의 세계와 깊이 연결됩니다.\n*   **창의성과 예술:** 감정에서 비롯되는 창의적 표현과 예술적 영감을 나타냅니다.\n*   **영성과 치유:** 내면의 평화, 영적 성장, 감정적 치유의 과정을 상징하기도 합니다.\n\n**컵 슈트의 카드들 (간략히):**\n*   **에이스 오브 컵스 (Ace of Cups):** 새로운 감정의 시작, 사랑, 기쁨, 창의적 잠재력.\n*   **투 오브 컵스 (Two of Cups):** 파트너십, 결합, 상호 존중, 조화로운 관계.\n*   **쓰리 오브 컵스 (Three of Cups):** 축하, 우정, 즐거운 모임, 공동체의 기쁨.\n*   ... (다른 컵 카드들에 대한 간략한 설명 추가 가능)\n*   **킹 오브 컵스 (King of Cups):** 감정적 성숙, 연민, 자제력, 외교적인 리더.\n\n컵 카드는 우리에게 감정을 느끼고 표현하는 것의 중요성을 일깨워줍니다. 또한, 타인과의 관계를 통해 배우고 성장하며, 내면의 목소리에 귀 기울일 것을 조언합니다. 당신의 리딩에 컵 카드가 자주 등장한다면, 지금은 당신의 감정과 관계에 주의를 기울여야 할 때일 수 있습니다.`,
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'tarot cups water',
    author: '타로 해설가',
    tags: ['컵슈트', '감정', '관계', '타로기초'],
    date: '2024-03-02',
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02'),
  },
  {
    id: 'sample-post-5',
    title: '매일 타로 한 장으로 시작하는 하루',
    slug: 'daily-tarot-draw-routine',
    excerpt: '매일 아침 타로 카드 한 장을 뽑는 간단한 습관이 어떻게 당신의 하루에 긍정적인 영향을 줄 수 있는지 알아보세요.',
    content: `바쁜 일상 속에서 잠시 멈춰 자신을 돌아보고 하루의 방향을 설정하는 것은 매우 중요합니다. 매일 타로 카드 한 장을 뽑는 것은 이러한 목적을 달성하는 데 도움이 되는 간단하면서도 강력한 도구가 될 수 있습니다.\n\n**데일리 타로, 왜 좋을까요?**\n*   **마음챙김:** 카드를 뽑는 행위 자체가 현재 순간에 집중하도록 돕습니다.\n*   **자기 성찰:** 카드의 이미지를 통해 그날의 감정이나 생각, 우선순위를 돌아볼 수 있습니다.\n*   **긍정적 의도 설정:** 카드에서 얻은 메시지를 바탕으로 하루를 어떻게 보내고 싶은지에 대한 긍정적인 의도를 설정할 수 있습니다.\n*   **직관력 향상:** 꾸준히 연습하면 카드와 소통하는 능력이 향상되고 직관력이 발달합니다.\n\n**데일리 타로 실천 방법:**\n1.  **준비:** 조용한 공간에서 편안하게 앉아 잠시 심호흡을 합니다.\n2.  **질문 (선택 사항):** "오늘 나에게 필요한 메시지는 무엇인가?" 또는 "오늘 내가 집중해야 할 에너지는 무엇인가?"와 같이 간단한 질문을 떠올릴 수 있습니다.\n3.  **카드 섞고 뽑기:** 덱을 충분히 섞은 후, 마음이 가는 카드 한 장을 뽑습니다.\n4.  **관찰 및 해석:** 카드의 이미지를 관찰하고, 떠오르는 생각이나 느낌을 적어봅니다. 카드의 전통적인 의미를 참고할 수도 있지만, 개인적인 직관을 우선시하세요.\n5.  **하루 적용:** 카드에서 얻은 통찰을 염두에 두고 하루를 보냅니다. 저녁에 다시 카드를 보며 하루를 되돌아보는 것도 좋습니다.\n\n데일리 타로는 복잡한 스프레드나 깊은 지식을 요구하지 않습니다. 단 한 장의 카드로도 충분히 의미 있는 메시지를 얻고, 하루를 더 의식적으로 살아가는 데 도움을 받을 수 있습니다. 오늘부터 시작해보는 것은 어떨까요?`,
    imageSrc: 'https://placehold.co/600x400.png',
    dataAiHint: 'daily routine morning',
    author: 'InnerSpell 팀',
    tags: ['데일리타로', '마음챙김', '자기계발', '습관'],
    date: '2024-02-28',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28'),
  },
];


export function mapDocToBlogPost(doc: FirebaseFirestore.DocumentSnapshot): BlogPost {
  const data = doc.data()!;
  const createdAtTimestamp = data.createdAt as Timestamp;
  const updatedAtTimestamp = data.updatedAt as Timestamp; 
  
  const createdAt = createdAtTimestamp ? createdAtTimestamp.toDate() : new Date();
  const updatedAt = updatedAtTimestamp ? updatedAtTimestamp.toDate() : createdAt; // If updatedAt is missing, use createdAt

  const isoDate = createdAt.toISOString();
  const formattedDate = isoDate.split('T')[0];

  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    imageSrc: data.imageSrc || 'https://placehold.co/600x400.png', 
    dataAiHint: data.dataAiHint || 'placeholder image',
    author: data.author || 'InnerSpell 팀',
    tags: data.tags || [],
    date: formattedDate, // YYYY-MM-DD format for display
    createdAt: createdAt, // Full Date object
    updatedAt: updatedAt, // Full Date object
  };
}


export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const snapshot = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      console.log(`Post with slug "${slug}" not found in Firestore, trying fallback posts.`);
      const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
      return fallbackPost ? { ...fallbackPost, createdAt: new Date(fallbackPost.date), updatedAt: new Date(fallbackPost.date) } : undefined;
    }
    return mapDocToBlogPost(snapshot.docs[0]);
  } catch (error) {
    console.error(`Error fetching post by slug ${slug} from Firestore, trying fallback posts:`, error);
    const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
    return fallbackPost ? { ...fallbackPost, createdAt: new Date(fallbackPost.date), updatedAt: new Date(fallbackPost.date) } : undefined;
  }
}

async function getSortedPostsWithFallback(order: 'asc' | 'desc'): Promise<BlogPost[]> {
  let posts: BlogPost[] = [];
  try {
    posts = await getAllPostsAction(); // This action now ensures createdAt/updatedAt
    if (posts.length === 0) {
        console.log("getAllPostsAction returned empty or failed, using fallback posts for sorting.");
        posts = [...fallbackBlogPosts].map(post => ({ // Ensure fallback has full date objects
          ...post,
          createdAt: new Date(post.date),
          updatedAt: new Date(post.date),
        }));
    }
  } catch (error) {
    console.error(`Error calling getAllPostsAction for sorted posts (${order}), using fallback posts:`, error);
    posts = [...fallbackBlogPosts].map(post => ({
      ...post,
      createdAt: new Date(post.date),
      updatedAt: new Date(post.date),
    }));
  }

  return posts.sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.date).getTime();
    const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}


export async function getPreviousPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPostsWithFallback('desc'); 
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex !== -1 && currentIndex < sortedPosts.length - 1) {
    return sortedPosts[currentIndex + 1]; 
  }
  return undefined;
}

export async function getNextPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPostsWithFallback('desc'); 
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex > 0) {
    return sortedPosts[currentIndex - 1]; 
  }
  return undefined;
}

export { fallbackBlogPosts };
