/// <reference path="DefinitelyTyped/node/node.d.ts"/>

import Suretate = require('./suretate/suretate');

new Suretate().watchProgreBoard();

//import Board = require('./suretate/board');

//function main() {
//        //.createNumberedThread('ぷろぐれch その$n', 1, 'テストです');
//    var subject = 'progremaster: The $nth Encounter';

//}

//function createNumberedThread(subject: string, num: number, message: string) {
//    var board = Board.get('radio', 22607);
//    board.createThread(subject.replace('$n', num.toString(10)), message, (err, result) => {
//        if (result) {
//            console.log('成功');
//        } else {
//            console.log('失敗');
//        }
//    });
//}

//main();
//'スレ建て依頼スレ'
///DP子?(?:さん|サン|ｻﾝ|ちゃん|チャン|ﾁｬﾝ|たん|タン|ﾀﾝ|様).*[「”“"’‘'´｀`\[](.+)[\]`｀´'‘’"“”」].*スレ[た立建]て/
