import http = require('http');
var Iconv = require('iconv').Iconv;
import putil = require('./../common/util');
import Enumerable = require('./../lib/linq');

var HOST = 'jbbs.livedoor.jp';

export class Board {
    static get(genre: string, boardNumber: number) {
        return new Board(genre, boardNumber);
    }

    /** @private */
    constructor(
        private genre: string,
        private boardNumber: number) {
    }

    //getLastThread2(
    //    subject: string,
    //    callback: (thread: { subject: string; num: number; res: number }) => void) {
    //    this.getThreadList((list: { subject: string; res: number }[]) => {
    //        callback(Enumerable.from(list)
    //            .select(x => ({
    //                match: x.subject.match(subject.replace('$n', '(\\d+)')),
    //                res: x.res
    //            }))
    //            .where(x => x.match != null)
    //            .select(x => ({
    //                subject: x.match[0],
    //                num: parseInt(x.match[1]),
    //                res: x.res
    //            }))
    //            .maxBy(x => x.num));
    //    });
    //}

    getLastThread(
        callback: (result: { res: number; thread: Thread; count: number }) => void) {
        this.getThreadList((list: { res: number; thread: Thread }[]) => {
            callback(Enumerable.from(list)
                .select(x => ({
                    res: x.res,
                    thread: x.thread,
                    count: x.thread.subject.match(/(\d+|[‚O‚P‚Q‚R‚S‚T‚U‚V‚W‚X]+|[Zˆê“ñOlŒÜ˜Zµ”ª‹ã])/)
                }))
                .where(x => x.count != null)
                .select(x => ({
                    res: x.res,
                    thread: x.thread,
                    count: parseInt(x.count[1]),
                }))
                .maxBy(x => x.count));
        });
    }

    getThreadList(callback: (list: { res: number; thread: Thread }[]) => void) {
        var path = '/' + this.genre + '/' + this.boardNumber + '/subject.txt';
        get(HOST, path, str => {
            callback(Enumerable.from(str.split('\n'))
                .where(x => x.length > 0)
                .select(x => x.match(/^(\d+)\.cgi,(.+)\((\d+)\)$/))
                .select(x => ({
                    res: parseInt(x[3], 10),
                    thread: this.getThread(parseInt(x[1]), x[2])
                }))
                .toArray());
        });
    }

    createThread(
        subject: string, message: string,
        callback: (err: any, result: boolean) => void) {
        var params = new CreateThreadParams(
            this.genre,
            this.boardNumber,
            new Date(),
            'DPq#miserarenaiyohash_atodehenkousuru',
            '',
            message,
            subject);
        post(HOST, '/bbs/write.cgi/', params.encodeURI(), (err, res) => {
            if (err != null) {
                callback(err, false);
                return;
            }
            callback(null, res.statusCode === 200);
        });
    }

    getThread(threadNumber: number, subject?: string) {
        return Thread.get(this.genre, this.boardNumber, threadNumber, subject);
    }
}

export class Thread {
    static get(genre: string, boardNumber: number, threadNumber: number, subject?: string) {
        return new Thread(genre, boardNumber, threadNumber, subject);
    }

    constructor(
        private genre: string,
        private boardNumber: number,
        private threadNumber: number,
        public subject?: string) {
    }

    getGreaterThan(res: number,
        callback: (reses: Res[]) => void): void {
        var path = '/bbs/rawmode.cgi/' + this.genre + '/' + this.boardNumber + '/' + this.threadNumber + '/' + res + '-';
        var resRegExp = /^(\d+)<>.*?<>.*?<>.*?<>(.*?)<>.*?<>$/;
        get(HOST, path, str => {
            callback(Enumerable.from(str.split('\n'))
                .select((x: string) => x.match(resRegExp))
                .where(x => x != null)
                .select(x => ({ res: parseInt(x[1]), message: x[2] }))
                .toArray());
        });
    }
}

export interface Res {
    res: number;
    message: string;
}

function get(host: string, path: string, callback: (str: string) => void) {
    var options = {
        host: host,
        path: path
    };
    http.get(options, res => {
        var buffer: NodeBuffer = null;
        res.on('readable', () => {
            if (buffer == null) {
                buffer = res.read();
            } else {
                buffer = Buffer.concat([buffer, res.read()]);
            }
        });
        res.on('end', a => callback(new Iconv('euc-jp', 'utf-8').convert(buffer).toString()));
    });
}

function post(host: string, path: string, encodedData: string, callback: (err: any, res: http.ServerResponse) => void) {
    var req = http.request({
        host: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': encodedData.length,
            'Accept-Charset': 'utf-8'
        }
    }, res => callback(null, res));
    req.on('error', e => {
        req.end();
        callback(e, null);
    });
    req.write(encodedData);
    req.end();
}

class CreateThreadParams {
    constructor(
        /** ”ÂƒWƒƒƒ“ƒ‹ */
        public dir: string,
        /** ”Â”Ô† */
        public bbs: number,
        /** “ŠeŠÔ */
        public time: Date,
        /** –¼‘O */
        public name: string,
        /** ƒ[ƒ‹ */
        public mail: string,
        /** –{•¶ */
        public message: string,
        /** ƒ^ƒCƒgƒ‹ */
        public subject: string) {
    }

    encodeURI() {
        var cnv = new EUCConverter();
        return [
            'DIR=' + this.dir,
            'BBS=' + this.bbs,
            'TIME=' + this.time.getTime(),
            'NAME=' + cnv.encodeURIComponent(this.name),
            'MAIL=' + cnv.encodeURIComponent(this.mail),
            'MESSAGE=' + cnv.encodeURIComponent(this.message),
            'SUBJECT=' + cnv.encodeURIComponent(this.subject),
            'submit=' + cnv.encodeURIComponent('V‹KƒXƒŒƒbƒhì¬')
        ].join('&');
    }
}

class EUCConverter {
    private iconv = new Iconv('utf-8', 'euc-jp');

    encodeURIComponent(str: string) {
        var buf: NodeBuffer;
        try {
            buf = this.iconv.convert(str);
        } catch (e) {
            return '%3f';// u?v
        }
        var encoded = '';
        for (var i = 0; i < buf.length; i++) {
            encoded += '%' + putil.padLeft(buf[i].toString(16), 2, '0');
        }
        return encoded;
    }
}
