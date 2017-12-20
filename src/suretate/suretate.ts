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
                // 950ˆÈ~‚ÅŸ”Ô‚ÌğŒ‚ğ–‚½‚µ‚½ƒŒƒX‚ğ’T‚·
                Enumerable.from(reses)
                    .where(x => x.message.index('ttp') <= 0)
                    .select((x: board.Res) => x.message.match(/(\d+|[‚O‚P‚Q‚R‚S‚T‚U‚V‚W‚X]+|[Zˆê“ñOlŒÜ˜Zµ”ª‹ã])/))
                    .where(x => x != null)
                    .where(x => toNumber(x[1]) === targetThreadCount)
                    .forEach(x => {
                        // ‚»‚¢‚Â‚ÅŸƒXƒŒ‚ğŒš‚Ä‚é
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
            case '‚O': return '0';
            case '‚P': return '1';
            case '‚Q': return '2';
            case '‚R': return '3';
            case '‚S': return '4';
            case '‚T': return '5';
            case '‚U': return '6';
            case '‚V': return '7';
            case '‚W': return '8';
            case '‚X': return '9';
            case 'Z': return '0';
            case 'ˆê': return '1';
            case '“ñ': return '2';
            case 'O': return '3';
            case 'l': return '4';
            case 'ŒÜ': return '5';
            case '˜Z': return '6';
            case 'µ': return '7';
            case '”ª': return '8';
            case '‹ã': return '9';
            default: '';
        }
    }).toArray().join(''), 10);
}

function toZenkaku(num: number) {
    Enumerable.from(num.toString(10)).select(x => {
        switch (x) {
            case '0': return '‚O';
            case '1': return '‚P';
            case '2': return '‚Q';
            case '3': return '‚R';
            case '4': return '‚S';
            case '5': return '‚T';
            case '6': return '‚U';
            case '7': return '‚V';
            case '8': return '‚W';
            case '9': return '‚X';
            default: '';
        }
    }).toArray().join('');
}

function toKansuji(num: number) {
    Enumerable.from(num.toString(10)).select(x => {
        switch (x) {
            case '0': return 'Z';
            case '1': return 'ˆê';
            case '2': return '“ñ';
            case '3': return 'O';
            case '4': return 'l';
            case '5': return 'ŒÜ';
            case '6': return '˜Z';
            case '7': return 'µ';
            case '8': return '”ª';
            case '9': return '‹ã';
            default: '';
        }
    }).toArray().join('');
}
