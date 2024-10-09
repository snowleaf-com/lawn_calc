'use strict';

document.addEventListener('DOMContentLoaded', main);

//入力値が０かマイナスの場合、エラーとする
function areValidNumbers(...nums) {
  for (const num of nums) {
    if (num <= 0) {
    return false;
    }
  }
  return true;
  }

function main() {
  // -----------------メイン計算関数----------------
  const mainCalc = (() => {
    const hirosaInput = document.getElementById("hirosa2");
    const hirosatuboInput = document.getElementById("hirosatubo2");
    const sanpuInput = document.getElementById("sanpu2");
    const sanpuaInput = document.getElementById("sanpua2");
    const bairituInput = document.getElementById("bairitu2");
    const sprayerInput = document.getElementById("sprayer");
    const sprayeryouryouInput = document.getElementById("sprayeryouryou");
    const hituyouySpan = document.getElementById("hituyouy2");
    const hituyoumSpan = document.getElementById("hituyoum2");
    const sanpukaisuuSpan = document.getElementById("sanpukaisuu");
    //展着剤input
    const tenchakuInput = document.getElementById("tenchaku");
    //展着剤結果
    const tenchakuSpan = document.getElementById("hituyout2");
  
    function convertTsuboToSquareMeter(tsubo) {
      return tsubo * 3.306;
    }
  
    function handleHirosatuboInput() {
      const hirosatubo = parseFloat(hirosatuboInput.value);
      if (isNaN(hirosatubo)) {
        hirosaInput.value = "";
        return;
      }
      const hirosa = convertTsuboToSquareMeter(hirosatubo);
      hirosaInput.value = hirosa.toFixed(2);
    }
  
    function handleSanpuaInput() {
      const sanpua = parseFloat(sanpuaInput.value);
      if (isNaN(sanpua)) {
        sanpuInput.value = "";
        return;
      }
      const sanpu = sanpua / 100;
      sanpuInput.value = sanpu.toFixed(2);
    }
  
    function handleCalculation() {
      const hirosa = parseFloat(hirosaInput.value);
      const sanpu = parseFloat(sanpuInput.value);
      const bairitu = parseFloat(bairituInput.value);
      const sprayer = parseFloat(sprayerInput.value);
      const sprayeryouryou = parseFloat(sprayeryouryouInput.value);
      const tenchaku = parseFloat(tenchakuInput.value);  

      //入力値チェック
      if(!areValidNumbers(hirosa, sanpu, bairitu, sprayer, sprayeryouryou)) {
        sanpukaisuuSpan.innerHTML = "入力値が不正です。";
        return;
      } else {
        sanpukaisuuSpan.innerHTML = "";
      }
      //入力値チェック後、項目入力チェック
      if (isNaN(hirosa) || isNaN(sanpu) || isNaN(bairitu) || isNaN(sprayer) || isNaN(sprayeryouryou)) {
        hituyouySpan.innerHTML = "";
        hituyoumSpan.innerHTML = "";
        sanpukaisuuSpan.innerHTML = "";
        return;
      }

  
      const a = hirosa * sanpu;//薬液ℓ
      const b = a / bairitu;//薬剤量ℓ
  
      const x = b * 1000;//薬剤量ml
      const y = (x * (bairitu / sprayer) - x);//水量ml
      const c = a * tenchaku;//展着剤量ml


      if(isNaN(c)) {
        if (x + y <= sprayeryouryou) {
            hituyouySpan.innerHTML = x.toFixed(2);
            hituyoumSpan.innerHTML = y.toFixed(2);
            sanpukaisuuSpan.innerHTML = "";
        } else {
          //計算
          function calculate(x, y, a) {
            const b = parseFloat((x + y) / a);
            const bDash = Math.floor(b);
            const total = x + y;
            const ratioX = x / total;
            const ratioY = y / total;
            const aX = (a * ratioX).toFixed(2);
            const aY = (a * ratioY).toFixed(2);
            const g = a * bDash;
            if (b % 1 === 0) {
              return { bDash, aX, aY };
            }
            const h = x + y - g;
            const i = (h * ratioX).toFixed(2);
            const j = (h * ratioY).toFixed(2);
            return { bDash, aX, aY, i, j };
          }
          
          // function calculate(x, y, a) {
          //     // スプレイヤー何個分b
          //     const b = parseFloat((x + y) / a);
          //     // スプレイヤー何個分bDash(切り捨て)
          //     const bDash = Math.floor(b);
          //     // xとyの比を求めてcに入れる
          //     let c;
          //     if (x >= y) {
          //       c = x / y;
          //     } else {
          //       c = y / x;
          //     }
          //     // 結果d= c/(c+1)
          //     const d = c / (c + 1);
          //     // スプレイヤー容量a*結果d=水e
          //     const e = (a * d).toFixed(2);
          //     // スプレイヤー容量a-水e=薬剤f
          //     const f = (a - e).toFixed(2);
          //     // スプレイヤー容量a*スプレイヤー何個分b=結果g
          //     const g = a * bDash;
          //     // bが小数でなければ、処理を中断して結果b、e、fを返す
          //     if (b % 1 === 0) {
          //       return { bDash, e, f };
          //     }
          
          //     // (x+y)-結果g=数字h
          //     const h = x + y - g;
          //     // 数字h*結果d=残り水i
          //     const i = (h * d).toFixed(2);
          //     // 数字h-残り水i=残り薬剤j
          //     const j = (h - i).toFixed(2);

          //     return { bDash, e, f, i, j };
          // }
          const result = calculate(x, y, sprayeryouryou);
          if (result && result.error) {
            sanpukaisuuSpan.textContent = result.error;
          } else {
            hituyouySpan.innerHTML = x.toFixed(2);
            hituyoumSpan.innerHTML = y.toFixed(2);
            if ('i' in result && 'j' in result) {
              sanpukaisuuSpan.innerHTML = `一次希釈液を分割して作る場合、<br>薬剤:${result.aX}㎖・水:${result.aY}㎖を${result.bDash}回。<br><br>残りの１回は薬剤:${result.i}㎖・水:${result.j}㎖。`;
            } else {
              sanpukaisuuSpan.innerHTML = `一次希釈液を分割して作る場合、<br>薬剤:${result.aX}㎖・水:${result.aY}㎖を${result.bDash}回行う。`;
            }
          }
        }
      } else {//展着剤がある場合
        if (x + y + c <= sprayeryouryou) {
            hituyouySpan.innerHTML = x.toFixed(2);
            hituyoumSpan.innerHTML = y.toFixed(2);
            tenchakuSpan.innerHTML = c.toFixed(2);
            sanpukaisuuSpan.innerHTML = "";
        } else {
          //計算
          function calculate(x, y, z, a) {
            try {
              const b = parseFloat((x + y + z) / a);
              const bDash = Math.floor(b);
              const total = x + y + z;
              const ratioX = x / total;
              const ratioY = y / total;
              const ratioZ = z / total;
              const aX = (a * ratioX).toFixed(2);
              const aY = (a * ratioY).toFixed(2);
              const aZ = (a * ratioZ).toFixed(2);
              const g = a * bDash;
              if (b % 1 === 0) {
                return { bDash, aX, aY, aZ };
              }
              const h = x + y + z - g;
              const i = (h * ratioX).toFixed(2);
              const j = (h * ratioY).toFixed(2);
              const k = (h * ratioZ).toFixed(2);
              return { bDash, aX, aY, aZ, i, j, k };
            } catch (error) {
              return { error: error.message };
            }
          }
          const result = calculate(x, y, c, sprayeryouryou);
          if (result && result.error) {
            sanpukaisuuSpan.textContent = result.error;
          } else {
            // エラーが発生しなかった場合の処理
            hituyouySpan.innerHTML = x.toFixed(2);
            hituyoumSpan.innerHTML = y.toFixed(2);
            tenchakuSpan.innerHTML = c.toFixed(2);
            if ('i' in result && 'j' in result && 'k' in result) {
              sanpukaisuuSpan.innerHTML = `一次希釈液を分割して作る場合、<br>薬剤:${result.aX}㎖・水:${result.aY}㎖・展着剤:${result.aZ}㎖を${result.bDash}回。<br><br>残りの１回は薬剤:${result.i}㎖・水:${result.j}㎖・展着剤を:${result.k}㎖。`;
            } else {
              sanpukaisuuSpan.innerHTML = `一次希釈液を分割して作る場合、<br>薬剤:${result.aX}㎖・水:${result.aY}㎖・展着剤:${result.aZ}㎖を${result.bDash}回行う。`;
            }
          }
        }
      }

      // スプレイヤーに何度入れるか処理
      // if(isNaN(c)) {
      //   if (x + y <= sprayeryouryou) {
      //     hituyouySpan.innerHTML = x.toFixed(2);
      //     hituyoumSpan.innerHTML = y.toFixed(2);
      //     sanpukaisuuSpan.innerHTML = "";
      //   } else {
      //     let w = x / 2;
      //     let z = y / 2;
      //     let e = 1;
      //     let wPlusZ = w + z;
      //     while (wPlusZ > sprayeryouryou) {
      //       e *= 2;
      //       w = x/(e + 1);
      //       z = y/(e + 1);
      //       wPlusZ = w + z;
      //     }
      //     hituyouySpan.innerHTML = w.toFixed(2);
      //     hituyoumSpan.innerHTML = z.toFixed(2);
      //     let d = `以上を${e + 1}回散布してください。`
      //     sanpukaisuuSpan.innerHTML = d;
      //   }
      // } else {
      //   if (x + y + c <= sprayeryouryou) {
      //     hituyouySpan.innerHTML = x.toFixed(2);
      //     hituyoumSpan.innerHTML = y.toFixed(2);
      //     tenchakuSpan.innerHTML = c.toFixed(2);
      //     sanpukaisuuSpan.innerHTML = "";
      //   } else {
      //     let w = x / 2;
      //     let z = y / 2;
      //     let f = c / 2;
      //     let e = 1;
      //     let wPlusZ = w + z + f;
      //     while (wPlusZ > sprayeryouryou) {
      //       e *= 2;
      //       w = x/(e + 1);
      //       z = y/(e + 1);
      //       f = c/(e + 1);
      //       wPlusZ = w + z + f;
      //     }
      //     hituyouySpan.innerHTML = w.toFixed(2);
      //     hituyoumSpan.innerHTML = z.toFixed(2);
      //     tenchakuSpan.innerHTML = f.toFixed(2);
      //     let d = `以上を${e + 1}回散布してください。`
      //     sanpukaisuuSpan.innerHTML = d;
      //   }
      // }
    }
  
    hirosatuboInput.addEventListener("input", handleHirosatuboInput);
    sanpuaInput.addEventListener("input", handleSanpuaInput);
    [hirosatuboInput, sanpuaInput, hirosaInput, sanpuInput, bairituInput, sprayerInput, sprayeryouryouInput, tenchakuInput].forEach(input => {
      input.addEventListener("input", handleCalculation);
    });
  })();


  //--------------使い方のモーダルを開く------------
  const modalHowTo = (() => {
    let modalOpen = false;
    // モーダルを開くボタンを取得
    const modalBtn = document.querySelector(".modal-btn");
  
    // モーダルコンテンツを取得
    const modal = document.querySelector(".modal");
  
    // 閉じるボタンを取得
    const closeBtn = document.querySelector(".close-btn");
  
    // モーダルを開くボタンをクリックした時の処理
    modalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    document.body.style.overflow = 'hidden';
    modalOpen = true;
    });
  
    // 閉じるボタンをクリックした時の処理
    closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
    modalOpen = false;
    });
  
    // モーダルの外側をクリックした時の処理
    window.addEventListener("click", (event) => {
    if (event.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
    modalOpen = false;
    }
    });
    // モーダルの外側をタップした時の処理
    window.addEventListener("touchend", (event) => {
    if (event.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
    modalOpen = false;
    }
    });
    // モーダルウィンドウが開いているときにスクロールを規制する
    window.addEventListener('scroll', function() {
    if (modalOpen) {
      window.scrollTo(0, 0);
    }
  });
  })();


  //------------------モーダル更新履歴を開く-----------
  const modalWhatsNew = (() => {
    let modalOpen = false;
    // モーダルを開くボタンを取得
    const modalBtn2 = document.querySelector(".modal-btn2");
  
    // モーダルコンテンツを取得
    const modal2 = document.querySelector(".modal2");
  
    // 閉じるボタンを取得
    const closeBtn2 = document.querySelector(".close-btn2");
  
    // モーダルを開くボタンをクリックした時の処理
    modalBtn2.addEventListener("click", () => {
      modal2.style.display = "block";
      document.body.style.overflow = 'hidden';
      modalOpen = true;
    });
  
    // 閉じるボタンをクリックした時の処理
    closeBtn2.addEventListener("click", () => {
      modal2.style.display = "none";
      document.body.style.overflow = 'auto';
      modalOpen = false;
    });
  
    // モーダルの外側をクリックした時の処理
    window.addEventListener("click", (event) => {
      if (event.target === modal2) {
      modal2.style.display = "none";
      document.body.style.overflow = 'auto';
      modalOpen = false;
      }
    });
    // モーダルの外側をタップした時の処理
    window.addEventListener("touchend", (event) => {
      if (event.target === modal2) {
      modal2.style.display = "none";
      document.body.style.overflow = 'auto';
      modalOpen = false;
      }
    });
    // モーダルウィンドウが開いているときにスクロールを規制する
    window.addEventListener('scroll', function() {
      if (modalOpen) {
        window.scrollTo(0, 0);
      }
    });
  })();



  //---------------展着剤のモーダルを開く-------------
  const modalTenchaku = (() => {
    let modalOpen = false;
    let savedScrollPosition = 0;
    // モーダルを開くボタンを取得
    const modalBtn3 = document.querySelector(".tenchaku_modal");
    // モーダルコンテンツを取得
    const modal3 = document.querySelector(".modal_tenchaku");
    // 閉じるボタンを取得
    const closeBtn3 = document.querySelector(".close-btn3");
    // モーダルを開くボタンをクリックした時の処理
    modalBtn3.addEventListener("click", () => {
    savedScrollPosition = window.pageYOffset;
    modal3.style.display = "block";
    document.body.style.overflow = 'hidden';
    modalOpen = true;
    });
    // ラジオボタンを取得
    const radioButton = document.getElementById("tenchakuOther");
    // inputフィールドを取得
    const inputField = document.getElementById("tenchakuNum");
    // ラジオボタンがクリックされた時に、inputフィールドにフォーカスを当てる
    radioButton.addEventListener("click", function() {
      inputField.focus();
    });
    // inputフィールドがフォーカスされた時に、ラジオボタンをチェックする
    inputField.addEventListener("input", function() {
      radioButton.checked = true;
    });
    //inputにてEnter押下で処理が走るようにする
    inputField.addEventListener("keydown", onKeyDown);
    function onKeyDown(event) {
      if (event.keyCode === 13 || event.key === "Enter") {
        selectedClick();
      }
    }

    // -----「選択」ボタンをクリックした時の処理
    document.querySelector('.modal-content3 #tenchaku_select').addEventListener('click', selectedClick);

    function selectedClick () {
      // 選択された項目を取得
      const selectedItem = document.querySelector('input:checked');
      //エラーメッセージを取得
      const existingErrorMessage = document.querySelector('.error-message');
      //エラーメッセージ2を取得
      const existingErrorMessage2 = document.querySelector('.error-message2');
      //何も選択されていない時
      if (selectedItem === null) {
        //さらにエラーメッセージがない時、表示する
        if (existingErrorMessage === null) {
        const errorMessage = document.createElement('span');
        errorMessage.textContent = '　いずれかを選択してください';
        errorMessage.style.color = 'red';
        document.querySelector('#tenchaku_select').parentNode.appendChild(errorMessage);
        errorMessage.classList.add('error-message');
        return;
        }
        return;
      }
      //選択されているものを取得
      let selectedValue = selectedItem.value;
        // 「その他」が選択されている場合、入力された値を追加する
        if (selectedValue === 'その他') {
          const inputValue = document.querySelector('#tenchakuNum').value;
          const existingErrorMessage = document.querySelector('.error-message');
          const existingErrorMessage2 = document.querySelector('.error-message2');
          // 「その他」が空欄の処理
          if (inputValue === '') {
            if (existingErrorMessage2 === null) {
              if (existingErrorMessage) {
                existingErrorMessage.textContent = '　入力してください';
                document.querySelector('#tenchakuNum').style.border = '5px solid red';
                return;
              }
              const errorMessage = document.createElement('span');
              errorMessage.textContent = '　入力・または半角入力してください';
              errorMessage.style.color = 'red';
              document.querySelector('#tenchaku_select').parentNode.appendChild(errorMessage);
              document.querySelector('#tenchakuNum').style.border = '5px solid red';
              errorMessage.classList.add('error-message2');
              return;
            }
            return;
          }
          //その他の場合も他と同様な処理にできるようにする
          selectedValue = `${selectedValue} ${inputValue}`;
        }
        //半角で区切ってあるものを配列で取得
        let selectedValueArg = selectedValue.split(' ');
        // 元のページのinputと表示名に値を設定
        document.querySelector('#tenchaku_name').textContent = selectedValueArg[0];
  
        const tenchakuNum = document.querySelector('#tenchaku');
        tenchakuNum.value = selectedValueArg[1];
        //強制的にinputイベントを発火させる
        const event = new Event('input', {
          bubbles: true,
          cancelable: true,
        });
        tenchakuNum.dispatchEvent(event);
  
        // モーダルウインドウを閉じる
        document.querySelector('.modal_tenchaku').style.display = 'none';
        document.body.style.overflow = 'auto';
        modalOpen = false;
        window.scrollTo(0, savedScrollPosition);
        savedScrollPosition = 0; // 初期化
    
        //モーダルを閉じた後の消去処理
        const selectedItemDelete = document.querySelector('input:checked');
        //チェックされているものがあれば消す
        if (selectedItem) {
          selectedItemDelete.checked = false;
        }
        const inputValue = document.querySelector('#tenchakuNum').value;
        //入力値があれば消す
        if (inputValue) {
          document.querySelector('#tenchakuNum').value = '';
        }
        //エラーメッセージがあれば消す
        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }
        if (existingErrorMessage2) {
          existingErrorMessage2.remove();
        }
        //エラー赤枠も消す
        document.querySelector('#tenchakuNum').style.border = 'none';
    }

    // 閉じるボタンをクリックした時の処理
    closeBtn3.addEventListener("click", () => {
    modal3.style.display = "none";
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
      
      const errorMessageDelete = document.querySelector(".error-message");
      const errorMessageDelete2 = document.querySelector(".error-message2");
      if (errorMessageDelete) {
        errorMessageDelete.remove();
      }
      if (errorMessageDelete2) {
        errorMessageDelete2.remove();
      }
      document.querySelector('#tenchakuNum').style.border = 'none';
    });
    
    // モーダルの外側をクリックした時の処理
    window.addEventListener("click", (event) => {
    if (event.target === modal3) {
    modal3.style.display = "none";
    document.body.style.overflow = 'auto';
    modalOpen = false;
    window.scrollTo(0, savedScrollPosition);savedScrollPosition = 0; // 初期化
      //モーダルを閉じた後の消去処理
      const selectedItemDelete = document.querySelector('input:checked');
      if (selectedItemDelete) {
        selectedItemDelete.checked = false;
      }
      const inputValue = document.querySelector('#tenchakuNum').value;
      if (inputValue) {
        document.querySelector('#tenchakuNum').value = '';
      }
      
      const errorMessageDelete = document.querySelector(".error-message");
      const errorMessageDelete2 = document.querySelector(".error-message2");
      if (errorMessageDelete) {
        errorMessageDelete.remove();
      }
      if (errorMessageDelete2) {
        errorMessageDelete2.remove();
      }
      document.querySelector('#tenchakuNum').style.border = 'none';
    }
    });
    // モーダルの外側をタップした時の処理
    window.addEventListener("touchend", (event) => {
    if (event.target === modal3) {
    modal3.style.display = "none";
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
      
      const errorMessageDelete = document.querySelector(".error-message");
      const errorMessageDelete2 = document.querySelector(".error-message2");
      if (errorMessageDelete) {
        errorMessageDelete.remove();
      }
      if (errorMessageDelete2) {
        errorMessageDelete2.remove();
      }
      document.querySelector('#tenchakuNum').style.border = 'none';
    }
    });
    // モーダルウィンドウが開いているときにスクロールを規制する
    window.addEventListener('scroll', function() {
      if (modalOpen) {
        window.scrollTo(0, 0);
      }
    });
  })();

  
  //-----------------クリアボタンを押した時の処理----------
  const clearButton = (() => {
        document.querySelector('#tenchaku_selectClear').addEventListener('click', () => {
          document.querySelectorAll("input[type='radio']").forEach(input => input.checked = false);
          document.querySelectorAll("input[type='number']").forEach(input => input.value = "");
          document.querySelector('#tenchaku_name').textContent = '';
          document.querySelector('#hituyouy2').textContent = '';
          document.querySelector('#hituyoum2').textContent = '';
          document.querySelector('#hituyout2').textContent = '';
          document.querySelector('#sanpukaisuu').textContent = '';
        });
  })();
};