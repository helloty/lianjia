"use strict";

var LandItem = function (text) {
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

LandItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Land = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new LandItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Land.prototype = {
    init: function () {
    },

    save: function (key, username, toname, addr, date, remark) {
        var from = Blockchain.transaction.from;
        var landItem = this.repo.get(key);
        if (landItem) {
            landItem.author = JSON.parse(landItem).author + '|-' + from;
            landItem.username = JSON.parse(landItem).username + '|-' + username;
            landItem.toname = JSON.parse(landItem).toname + '|-' + toname;
            landItem.addr = JSON.parse(landItem).addr + '|-' + addr;
            landItem.date = JSON.parse(landItem).date + '|-' + date;
            landItem.remark = JSON.parse(landItem).remark + '|-' + remark;
            this.repo.put(key, landItem);

        } else {
            landItem = new LandItem();
            landItem.key = key;
            landItem.author = from;
            landItem.username = username;
            landItem.toname = toname;
            landItem.date = date;
            landItem.addr = addr;
            landItem.remark = remark;
            this.repo.put(key, landItem);
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
module.exports = Land;