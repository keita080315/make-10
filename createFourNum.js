let methodArr = [];
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
            methodArr.push([i,j,k]);
        }
    }
}

let resultArr = [];

for (let i = 0; i <= 9999; i++) {
    if (i < 10) {
        i = ('000' + i).slice(-4);
    } else if (i < 100) {
        i = ('00' + i).slice(-4);
    } else if (i < 1000) {
        i = ('0' + i).slice(-4);
    }
    let arr = Array.from(String(i),Number);
    for (let j = 0; j < methodArr.length; j++){
        let makeNum = arr[0];
        for (let k = 0; k < 3; k++){
            makeNum = math(methodArr[j][k],makeNum,arr[k+1])
        }
        if (makeNum === 10){
            resultArr.push(arr);
            console.log(arr);
            break;
        }
    }
}

console.log(resultArr);

function math(method,makeNum,nextNum){
    switch (method){
        case 0:
            makeNum += nextNum
        break
        case 1:
            makeNum -= nextNum
        break;
        case 2:
            makeNum *= nextNum
        break;
        case 3:
            makeNum /= nextNum
        break;
    }
    return Math.abs(makeNum);
}

// 順列
// const permutation = (arr, number) => {
//     let ans = []
//     if (number === 1) {
//         for (let i = 0; i < arr.length; i++) {
//             ans[i] = [arr[i]]
//         }
//     } else {
//         for (let i = 0; i < arr.length; i++) {
//             let parts = arr.slice(0)
//             parts.splice(i, 1)[0]
//             let row = permutation(parts, number - 1)
//             for (let j = 0; j < row.length; j++) {
//                 ans.push([arr[i]].concat(row[j]))
//             }
//         }
//     }
//     return ans;
// }