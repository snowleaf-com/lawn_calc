'use strict';

document.addEventListener('DOMContentLoaded', main);

function main() {
    document.forms.genDil.genDilInput.addEventListener('click', () => {
        let val1 = document.forms.genDil.num1.value;
        let val2 = document.forms.genDil.num2.value;
        let ans1 = val2 / val1;
        let ans2 = ans1 * 1000;
        let text1 = document.getElementById("ans1");
        let text2 = document.getElementById("ans2");
        text1.textContent = ans1;
        text2.textContent = ans2;
    });
    document.forms.sprayer.spInput.addEventListener('click', () => {
        let val1 = document.forms.sprayer.num1.value;
        let val2 = document.forms.sprayer.num2.value;
        let val3 = document.forms.sprayer.num3.value;
        let ans1 = val2 / (val1 / val3);
        let ans2 = ans1 * (val1 / val3) - ans1;
        let text1 = document.getElementById("ans3");
        let text2 = document.getElementById("ans4");
        text1.textContent = ans1;
        text2.textContent = ans2;
    });
}