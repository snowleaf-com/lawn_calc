'use strict';
document.addEventListener('DOMContentLoaded', main);

let selectedValueArg;//展着剤の中身の配列
let selectedValue;//展着剤のvalue
let selectedItem;//展着剤のelement
let errorMessage;
let savedScrollPosition;
let modalOpen;

function main() {
  const calc = document.querySelector('#calc');
  calc.addEventListener('click', calculation);
  
  const tenchaku = document.querySelector('#adjuvant-select');
  tenchaku.addEventListener('click', tenchakuModal);
  
  const perAreaInput = document.getElementById("per-area");
  const choiPerAreaSelect = document.getElementById("choi-per-area");
  const amountSpans = document.querySelectorAll(".amount-span");
  
  const displaySelectedValue = () => {
    const selectedValue = perAreaInput.value;
    const selectedUnit = choiPerAreaSelect.options[choiPerAreaSelect.selectedIndex].text;
    amountSpans.forEach((amountSpan) => {
      amountSpan.textContent = `${selectedValue}${selectedUnit}`;
    });
  };
  // 初期表示のために一度実行
  displaySelectedValue();
  perAreaInput.addEventListener("input", displaySelectedValue);
  choiPerAreaSelect.addEventListener("change", displaySelectedValue); 
}

//----------------計算関数---------------------------
function calculation(e) {
  e.preventDefault();
  const choiSize = parseInt(document.getElementById("choi-size").value);
  const choiPerArea = parseInt(document.getElementById("choi-per-area").value);
  const chemicalAmount = document.getElementById("chemical-amount").value;
  const adjuvant = document.getElementById("adjuvant").value;
  let waterAmount = document.getElementById("water-amount").value;
  let size = document.getElementById("size").value;
  let perArea = document.getElementById("per-area").value;
  let errorFlg = false;

  // 必須項目が入力されているかチェック
  if (size === "" || perArea === "" || chemicalAmount === "" || waterAmount === "") {
    errorFlg = true;
  } else if (size <= 0 || perArea <= 0 || chemicalAmount <= 0 || waterAmount <= 0) {
    errorFlg = true;
  }


  // エラーメッセージがあれば表示
  if (errorFlg) {
    // document.getElementById("calc").insertAdjacentHTML("beforebegin", `<p class="error-message">${errorMessage}</p>`);
    if (size === "") document.getElementById("size").style.border = "1px solid red";
    if (size <= 0) document.getElementById("size").style.border = "1px solid red";
    if (perArea === "") document.getElementById("per-area").style.border = "1px solid red";
    if (perArea <= 0) document.getElementById("per-area").style.border = "1px solid red";
    if (chemicalAmount === "") document.getElementById("chemical-amount").style.border = "1px solid red";
    if (chemicalAmount <= 0) document.getElementById("chemical-amount").style.border = "1px solid red";
    if (waterAmount === "") document.getElementById("water-amount").style.border = "1px solid red";
    if (waterAmount <= 0) document.getElementById("water-amount").style.border = "1px solid red";
    return;
  } else {
    document.getElementById("size").style.border = "1px solid #ccc";
    document.getElementById("per-area").style.border = "1px solid #ccc";
    document.getElementById("chemical-amount").style.border = "1px solid #ccc";
    document.getElementById("water-amount").style.border = "1px solid #ccc";
  }

  
  // 庭の広さの単位変換
  if (choiSize === 1) {
    size /= 100; // ㎡からアールへ変換
    console.log(size + "平米からアール");
  } else if (choiSize === 2) {
    size *= 0.033; // 坪からアールへ変換
    console.log(size + "ツボからアール");
  }
  
  // あたり使用量の単位変換
  if (choiPerArea === 2) {
    perArea /= 100; // ㎡からアールへ変換
    console.log(perArea + "平米からアール");
  }

  // ℓを㎖へ変換
  waterAmount *= 1000;
  
  // 結果Aの計算
  const resultA = chemicalAmount / perArea * size;
  console.log(resultA + " 薬剤必要量")
  // 結果Bの計算
  const resultB = waterAmount / perArea * size;
  console.log(resultB + " 水必要量")
  
  // 展着剤の入力があれば結果Dの計算
  let resultC = 0;
  if (!isNaN(adjuvant)) {
    resultC = ((resultA + resultB) / 1000) * adjuvant;
  }
  
  // 結果の表示
  document.getElementById("necessary-chemical-amount").textContent = resultA.toFixed(2);
  document.getElementById("necessary-chemical-amount-liter").textContent = ( resultA / 1000 ).toFixed(4);
  document.getElementById("necessary-water-amount").textContent = resultB.toFixed(2);
  document.getElementById("necessary-water-amount-liter").textContent = (resultB / 1000).toFixed(4); // ㎖からℓへ変換
  document.getElementById("necessary-adjuvant-amount").textContent = resultC.toFixed(2);
  
}

//---------------------------------------------------


//---------------展着剤のモーダルを開く-------------
function tenchakuModal() {
  // モーダルコンテンツを取得
  const modal = document.querySelector(".modal_tenchaku");
  // 閉じるボタンを取得
  const closeBtn = document.querySelector(".close-btn");
  // その他のラジオボタンを取得
  const radioButton = document.getElementById("tenchakuOther");
  // その他のinputフィールドを取得
  const inputField = document.getElementById("tenchakuNum");
  // 全てのradioボタンを取得
  const radios = document.getElementsByName('option');
  // クリアボタンを取得
  const clear = document.getElementById('tenchaku_selectClear');
  // エラーコンテナを取得
  const errorContainer = document.querySelector('.errorContainer');

  //閉じた後の処理
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
    modalOpen = false;
    window.scrollTo(0, savedScrollPosition);
    savedScrollPosition = 0; // 初期化
    //モーダルを閉じた後の消去処理
    const selectedItemDelete = document.querySelector('input:checked');
    if (selectedItemDelete) {
      selectedItemDelete.checked = false;
    }
    const inputValue = document.querySelector('#tenchakuNum').value;
    if (inputValue) {
      document.querySelector('#tenchakuNum').value = '';
    }
    if (errorMessage) {
      errorMessage.remove();
    }
    document.querySelector('#tenchakuNum').style.border = '1px solid #ccc';
  }
  
  // モーダルを開くボタンをクリックした時の処理
  savedScrollPosition = window.pageYOffset;
  modal.style.display = "block";
  document.body.style.overflow = 'hidden';
  modalOpen = true;

  //選択しているものを共有する処理
  if (typeof selectedValueArg !== 'undefined') {
    if (selectedValueArg[0] === "その他") {
      document.querySelector('#tenchakuNum').value = selectedValueArg[1];
      selectedItem = document.querySelector('#tenchakuOther');
      selectedItem.checked = true;
    } else {
      radios.forEach((radio) => {
        if (radio.value === selectedValue) {
          selectedItem = radio;
          selectedItem.checked = true;
        }
      });
    }
  }

  // ラジオボタンがクリックされた時に、inputフィールドにフォーカスを当てる
  radioButton.addEventListener("click", function() {
    inputField.focus();
  });
  // inputフィールドがフォーカスされた時に、ラジオボタンをチェックする
  inputField.addEventListener("input", function() {
    radioButton.checked = true;
  });
  // inputにてEnter押下で処理が走るようにする
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      selectedClick();
    }
  });
  // ==========「クリア」ボタンの処理================
  clear.addEventListener('click', () => {
    radios.forEach((radio) => {
      if (radio.checked === true) {
        radio.checked = false;
      }
    });
    inputField.value = '';
    selectedValueArg = undefined;//展着剤を選択し、その中身
    selectedValue = undefined;//展着剤を選択した容量
    selectedItem = undefined;//展着剤自体
    document.querySelector('#adjuvant-select').textContent = '選択する';
    document.querySelector('#adjuvant').value = '';
    //エラーメッセージがあれば消す
    if (errorMessage) {
      errorMessage.remove();
    }
    //エラー赤枠も消す
    document.querySelector('#tenchakuNum').style.border = '1px solid #ccc';
  });

  // -----「選択」ボタンをクリックした時の処理
  document.querySelector('.modal-content #tenchaku_select').addEventListener('click', selectedClick);

  //選択関数
  function selectedClick () {
    selectedItem = document.querySelector('input:checked');
    //エラーメッセージを取得
    errorMessage = document.querySelector('.error-message');
    //何も選択されていない時
    if (selectedItem === null) {
      //さらにエラーメッセージがない時、表示する
      if (errorMessage === null) {
      errorMessage = document.createElement('p');
      errorMessage.textContent = 'いずれかを選択してください';
      errorContainer.insertBefore(errorMessage, errorContainer.firstChild);
      errorMessage.classList.add('error-message');
      return;
      }
      return;
    }
    //選択されているものを取得
    selectedValue = selectedItem.value;
    // 「その他」が選択されている場合、入力された値を追加する
    if (selectedValue === 'その他') {
      const inputValue = inputField.value;
      errorMessage = document.querySelector('.error-message');
      // 「その他」が空欄の処理
      if (inputValue === '') {
          if (errorMessage) {
            errorMessage.textContent = '入力・または半角入力してください';
            document.querySelector('#tenchakuNum').style.border = '5px solid red';
            return;
          }
          errorMessage = document.createElement('p');
          errorMessage.textContent = '入力・または半角入力してください';
          errorContainer.insertBefore(errorMessage, errorContainer.firstChild);
          errorMessage.classList.add('error-message');
          return;
      }
      //その他の場合も他と同様な処理にできるようにする
      selectedValue = `${selectedValue} ${inputValue}`;
    }
    //半角で区切ってあるものを配列で取得
    selectedValueArg = selectedValue.split(' ');
    // 元のページのinputと表示名に値を設定
    document.querySelector('#adjuvant-select').textContent = selectedValueArg[0];
    const tenchakuNum = document.querySelector('#adjuvant');
    tenchakuNum.value = selectedValueArg[1];

    // モーダルウインドウを閉じる
    document.querySelector('.modal_tenchaku').style.display = 'none';
    document.body.style.overflow = 'auto';
    modalOpen = false;
    window.scrollTo(0, savedScrollPosition);
    savedScrollPosition = 0; // 初期化

    //エラーメッセージがあれば消す
    if (errorMessage) {
      errorMessage.remove();
    }
    //エラー赤枠も消す
    document.querySelector('#tenchakuNum').style.border = '1px solid #ccc';
  }


  // 閉じるボタンをクリックした時の処理
  closeBtn.addEventListener("click", () => {
    closeModal();
  });
      
  // モーダルの外側をクリックした時の処理
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  // モーダルの外側をタップした時の処理
  window.addEventListener("touchend", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  // モーダルウィンドウが開いているときにスクロールを規制する
  window.addEventListener('scroll', function() {
    if (modalOpen) {
      window.scrollTo(0, 0);
    }
  });
}