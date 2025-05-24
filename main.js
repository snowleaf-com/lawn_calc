const works = [
  {
    title: '希釈倍率計算ソフト（スプレイヤー対応）',
    description:
      'スプレイヤー（希釈散布機）を用いる際、庭の面積(㎡・坪)・散布量(ℓ/㎡・ℓ/a)から希釈倍率の計算を行えます。',
    url: 'dilutionRatioSprayer/',
    icon: 'fas fa-spray-can',
  },
  {
    title: '希釈倍率計算ソフト（一般希釈用）',
    description:
      '庭の面積(㎡・坪)・散布量(ℓ/㎡・ℓ/a)から希釈倍率の計算を行えます。',
    url: 'dilutionRatio/',
    icon: 'fas fa-tint',
  },
  {
    title: '除草剤計算',
    description:
      '庭の面積（㎡・坪・アール）と、あたり使用量（アール・㎡）から必要薬剤・水を計算します。',
    url: 'dilutionHerbicide/',
    icon: 'fas fa-leaf',
  },
  {
    title: '窒素量計算',
    description:
      '庭の面積、お手持ちの肥料の窒素含有率、必要窒素量から、必要肥料量を算出。逆にこの量を撒くと、平米あたりどのくらい窒素量を得られるのかも算出します。',
    url: 'nitrogenCalc/',
    icon: 'fas fa-atom',
  },
  {
    title: '希釈倍率計算ソフト（簡易版）',
    description: 'スプレイヤー・一般用の簡易版。初代です。',
    url: 'dR1/',
    icon: 'fas fa-calculator',
  },
]
const works2 = [
  {
    title: '砂利・土を敷く際の必要袋数計算ソフト',
    description:
      'その名の通り、砂利や土を敷く際に敷き厚やその素材の比重から必要立米・必要袋数を計算します。',
    url: 'calcNumBags/',
    icon: 'fas fa-mountain',
  },
]

const workList = document.getElementById('work-list1')
const workList2 = document.getElementById('work-list2')

function createToolCard(work) {
  const div = document.createElement('div')
  div.className = 'tool-card'
  div.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
      <i class="${work.icon}" style="font-size: 2rem; color: #22c55e;"></i>
      <h3 style="margin: 0;">${work.title}</h3>
    </div>
    <p>${work.description}</p>
    <button class="tool-button" onclick="location.href='${work.url}'">
      <i class="fas fa-arrow-right" style="margin-right: 0.5rem;"></i>
      計算を開始する
    </button>
  `
  return div
}

works.forEach((work) => {
  const card = createToolCard(work)
  workList.appendChild(card)
})

works2.forEach((work) => {
  const card = createToolCard(work)
  workList2.appendChild(card)
})

// Add scroll animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
    }
  })
}, observerOptions)

// Apply initial styles and observe cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.tool-card')
  cards.forEach((card, index) => {
    // Set initial state
    card.style.opacity = '0'
    card.style.transform = 'translateY(50px)'
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`

    // Start observing
    observer.observe(card)
  })
})
