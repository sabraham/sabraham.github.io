function Queue () {
    this.front = [];
    this.back = [];
    this.push = function (x) {
        if (this.front.length) {
            this.back.push(x);
        } else {
            this.front.push(x);
        }
    }
    this.pop = function () {
        if (this.front.length) {
            var ret = this.front.pop();
            if (! this.front.length) {
                this.front = this.back.reverse();
                this.back = [];
            }
            return ret;
        } else {
            this.front = this.back.reverse();
            this.back = [];
            return this.front.pop();
        }
    }
}
