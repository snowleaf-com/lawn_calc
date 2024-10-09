function calculateFertilizer() {
  var area = document.getElementById('area').value; // 面積を入力から取得
  var nitrogenPerSquareMeter = document.getElementById('nitrogenPerSquareMeter').value; // 1㎡あたりの必要窒素量を入力から取得
  var nitrogenPercentage = document.getElementById('nitrogenPercentage').value; // 肥料の窒素含有率を入力から取得

  // 全体で必要な窒素の総量を計算
  var totalNitrogenNeeded = area * nitrogenPerSquareMeter;

  // パーセンテージを小数に変換
  var nitrogenDecimal = nitrogenPercentage / 100;

  // 窒素含有率に基づいて必要な肥料の総量を計算
  var fertilizerNeeded = totalNitrogenNeeded / nitrogenDecimal;

  // 結果を表示
  document.getElementById('result').textContent = `必要な肥料の量は${fertilizerNeeded.toFixed(2)}g（約${(fertilizerNeeded / 1000).toFixed(2)}kg）です。`;
}



function calculateNitrogenPerSquareMeter() {
  var area2 = document.getElementById('area2').value; // 面積を入力から取得
  var nitrogenPercentage2 = document.getElementById('nitrogenPercentage2').value; // 肥料の窒素含有率を入力から取得
  var fertilizerAmount = document.getElementById('fertilizerAmount').value; // 散布する肥料の総量を入力から取得

  // パーセンテージを小数に変換
  var nitrogenDecimal2 = nitrogenPercentage2 / 100;

  // 散布される肥料の総量から窒素の総量を計算
  var totalNitrogen = fertilizerAmount * nitrogenDecimal2;

  // 窒素の総量を面積で割って平米あたりの窒素量を計算
  var nitrogenPerSquareMeter = totalNitrogen / area2;

  // 結果を表示
  document.getElementById('result2').textContent = `平米あたりの窒素量は${nitrogenPerSquareMeter.toFixed(2)}グラムです。`;
}