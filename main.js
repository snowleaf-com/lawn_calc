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
    <div class="tool-card__head">
      <i class="tool-card__icon ${work.icon}" aria-hidden="true"></i>
      <h3 class="tool-card__title">${work.title}</h3>
    </div>
    <p class="tool-card__desc">${work.description}</p>
    <a class="tool-button" href="${work.url}">
      <span>計算を開始する</span>
      <i class="fas fa-arrow-right tool-button__arrow" aria-hidden="true"></i>
    </a>
  `
  return div
}

works.forEach((work) => {
  workList.appendChild(createToolCard(work))
})

works2.forEach((work) => {
  workList2.appendChild(createToolCard(work))
})

const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('tool-card--visible')
    }
  })
}, observerOptions)

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tool-card').forEach((card) => {
    observer.observe(card)
  })
})
