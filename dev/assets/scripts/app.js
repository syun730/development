fizzbuzz();

function fizzbuzz() {
  for(i = 1; i <= 100; i++) {
    if(i%15 == 0) {// 3と5の倍数
      console.log(i + '番目 fizzbuzz')
    } else if(i%3 == 0) {// 3の倍数
      console.log(i + '番目 fizz')
    } else if(i%5 == 0) {// 5の倍数
      console.log(i + '番目 buzz')
    } else {// それ以外
      console.log(i + '番目')
    }
  }
}
