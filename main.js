const works = [
  {
    title: "希釈倍率計算ソフト（スプレイヤー対応）",
    description:
      "スプレイヤー（希釈散布機）を用いる際、庭の面積(㎡・坪)・散布量(ℓ/㎡・ℓ/a)から希釈倍率の計算を行えます。",
    url: "https://garden.snow-leaf.com/dilutionRatioSprayer/",
  },
  {
    title: "希釈倍率計算ソフト（一般希釈用）",
    description:
      "庭の面積(㎡・坪)・散布量(ℓ/㎡・ℓ/a)から希釈倍率の計算を行えます。",
    url: "https://garden.snow-leaf.com/dilutionRatio/",
  },
  {
    title: "除草剤計算",
    description:
      "庭の面積（㎡・坪・アール）と、あたり使用量（アール・㎡）から必要薬剤・水を計算します。",
    url: "https://garden.snow-leaf.com/dilutionHerbicide/",
  },
  {
    title: "窒素量計算",
    description:
      "庭の面積、お手持ちの肥料の窒素含有率、必要窒素量から、必要肥料量を算出。逆にこの量を撒くと、平米あたりどのくらい窒素量を得られるのかも算出します。",
    url: "https://garden.snow-leaf.com/nitrogenCalc/",
  },
  {
    title: "希釈倍率計算ソフト（簡易版）",
    description: "スプレイヤー・一般用の簡易版。初代です。",
    url: "https://garden.snow-leaf.com/dR1/",
  },
];
const works2 = [
  {
    title: "砂利・土を敷く際の必要袋数計算ソフト",
    description:
      "その名の通り、砂利や土を敷く際に敷き厚やその素材の比重から必要立米・必要袋数を計算します。",
    url: "https://garden.snow-leaf.com/calcNumBags/",
  },
];

const workList = document.getElementById("work-list1");
const workList2 = document.getElementById("work-list2");

works.forEach((work) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <h3>${work.title}</h3>
    <p>${work.description}</p>
    <button onclick="location.href='${work.url}'">こちらから進む</button>
  `;
  workList.appendChild(li);
});
works2.forEach((work) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <h3>${work.title}</h3>
    <p>${work.description}</p>
    <button onclick="location.href='${work.url}'">こちらから進む</button>
  `;
  workList2.appendChild(li);
});
