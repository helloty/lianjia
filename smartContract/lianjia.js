"use strict";

var LianjiaItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.username = obj.username;
        this.date = obj.date;
        this.addr = obj.addr;
        this.toname = obj.toname;
        this.remark = obj.remark;
        this.author=obj.author;
    } else {
        this.key = "";
        this.username = "";
        this.date = "";
        this.addr = "";
        this.toname = "";
        this.remark = "";
        this.author="";
    }
};

LianjiaItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Lianjia = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new LianjiaItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Lianjia.prototype = {
    init: function () {
    },

    save: function (key, username, toname, addr, date, remark) {
        var from = Blockchain.transaction.from;
        var lianjiaItem = this.repo.get(key);
        if (lianjiaItem) {
            lianjiaItem.author = JSON.parse(lianjiaItem).author + '|-' + from;
            lianjiaItem.username = JSON.parse(lianjiaItem).username + '|-' + username;
            lianjiaItem.toname = JSON.parse(lianjiaItem).toname + '|-' + toname;
            lianjiaItem.addr = JSON.parse(lianjiaItem).addr + '|-' + addr;
            lianjiaItem.date = JSON.parse(lianjiaItem).date + '|-' + date;
            lianjiaItem.remark = JSON.parse(lianjiaItem).remark + '|-' + remark;
            this.repo.put(key, lianjiaItem);

        } else {
            lianjiaItem = new LianjiaItem();
            lianjiaItem.key = key;
            lianjiaItem.author = from;
            lianjiaItem.username = username;
            lianjiaItem.toname = toname;
            lianjiaItem.date = date;
            lianjiaItem.addr = addr;
            lianjiaItem.remark = remark;
            this.repo.put(key, lianjiaItem);
        }
    },

    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    }
};
module.exports = Lianjia;