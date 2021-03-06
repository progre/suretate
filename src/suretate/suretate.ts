import board = require('./board');
import Enumerable = require('./../lib/linq');

export = Suretate;
class Suretate {
    watchProgreBoard() {
        var LIMIT = 0;
        var bd = board.Board.get('radio', 22607);
        bd.getLastThread(result => {
            if (result.res < LIMIT)
                return this.next();
            var targetThreadCount = 5//result.count + 1;
            result.thread.getGreaterThan(LIMIT, (reses: board.Res[]) => {
                // 950以降で次番の条件を満たしたレスを探す
                Enumerable.from(reses)
                    .where(x => x.message.index('ttp') <= 0)
                    .select((x: board.Res) => x.message.match(/(\d+|[０１２３４５６７８９]+|[〇一二三四五六七八九])/))
                    .where(x => x != null)
                    .where(x => toNumber(x[1]) === targetThreadCount)
                    .forEach(x => {
                        // そいつで次スレを建てる
                        bd.createThread(
                    });
            });
        });

    }

    private next(): void {
        setTimeout(this.watchProgreBoard, 10 * 60 * 1000);
    }

    private createNextThread() {
    }
}

function toNumber(str: string) {
    return parseInt(Enumerable.from(str).select(x => {
        switch (x) {
            case '0': return '0';
            case '1': return '1';
            case '2': return '2';
            case '3': return '3';
            case '4': return '4';
            case '5': return '5';
            case '6': return '6';
            case '7': return '7';
            case '8': return '8';
            case '9': return '9';
            case '０': return '0';
            case '１': return '1';
            case '２': return '2';
            case '３': return '3';
            case '４': return '4';
            case '５': return '5';
            case '６': return '6';
            case '７': return '7';
            case '８': return '8';
            case '９': return '9';
            case '〇': return '0';
            case '一': return '1';
            case '二': return '2';
            case '三': return '3';
            case '四': return '4';
            case '五': return '5';
            case '六': return '6';
            case '七': return '7';
            case '八': return '8';
            case '九': return '9';
            default: '';
        }
    }).toArray().join(''), 10);
}

function toZenkaku(num: number) {
    Enumerable.from(num.toString(10)).select(x => {
        switch (x) {
            case '0': return '０';
            case '1': return '１';
            case '2': return '２';
            case '3': return '３';
            case '4': return '４';
            case '5': return '５';
            case '6': return '６';
            case '7': return '７';
            case '8': return '８';
            case '9': return '９';
            default: '';
        }
    }).toArray().join('');
}

function toKansuji(num: number) {
    Enumerable.from(num.toString(10)).select(x => {
        switch (x) {
            case '0': return '〇';
            case '1': return '一';
            case '2': return '二';
            case '3': return '三';
            case '4': return '四';
            case '5': return '五';
            case '6': return '六';
            case '7': return '七';
            case '8': return '八';
            case '9': return '九';
            default: '';
        }
    }).toArray().join('');
}
