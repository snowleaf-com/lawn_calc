'use strict';
import { addCommasToNumber } from './add_commas_to_number.js';

document.addEventListener('DOMContentLoaded', main);

function main () {
  (() => {
    const hirosatuboInput = document.getElementById('hirosatubo1');
    const hirosaInput = document.getElementById('hirosa1');
    const sanpuInput = document.getElementById('sanpu1');
    const sanpuaInput = document.getElementById('sanpua1');
    const bairituInput = document.getElementById('bairitu1');
    const hituyouyOutput = document.getElementById('hituyouy1');
    const hituyouylOutput = document.getElementById('hituyouyl1');
    const hituyoumOutput = document.getElementById('hituyoum1');
    const hituyoumlOutput = document.getElementById('hituyouml1');
    
    hirosatuboInput.addEventListener('input', () => {
      const hirosatubo = parseFloat(hirosatuboInput.value);
      if (isFinite(hirosatubo)) {
        hirosaInput.value = (hirosatubo * 3.3058).toFixed(2);
      }
    });
    
    sanpuaInput.addEventListener('input', () => {
      const sanpua = parseFloat(sanpuaInput.value);
      if (isFinite(sanpua)) {
        sanpuInput.value = (sanpua / 100).toFixed(2);
      }
    });
    
    function calculate() {
      const hirosa = parseFloat(hirosaInput.value);
      const sanpu = parseFloat(sanpuInput.value);
      const bairitu = parseFloat(bairituInput.value);
    
      if (!isFinite(hirosa) || !isFinite(sanpu) || !isFinite(bairitu)) {
        return;
      }
    
      const x = hirosa * sanpu;
      const y = x / bairitu;//ℓ
      const z = y * 1000;//ml
    
      if (!isFinite(y) || !isFinite(z)) {
        return;
      }
    
      hituyouylOutput.textContent = y.toFixed(4);
      hituyouyOutput.textContent = z.toFixed(1);
      hituyoumlOutput.textContent = (x - y).toFixed(4);
      hituyoumOutput.textContent = addCommasToNumber(((x * 1000) - z).toFixed(1));
    }
    
    [hirosatuboInput, sanpuInput, hirosaInput, sanpuaInput, bairituInput].forEach((input) => {
      input.addEventListener('input', calculate);
    });
  })();

  (() => {
    // モーダルを開くボタンを取得
    const modalBtn = document.querySelector(".modal-btn");

    // モーダルコンテンツを取得
    const modal = document.querySelector(".modal");

    // 閉じるボタンを取得
    const closeBtn = document.querySelector(".close-btn");

    // モーダルを開くボタンをクリックした時の処理
    modalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    });

    // 閉じるボタンをクリックした時の処理
    closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    });

    // モーダルの外側をクリックした時の処理
    window.addEventListener("click", (event) => {
    if (event.target === modal) {
    modal.style.display = "none";
    }
    });
})();

}
