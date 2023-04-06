// a class represents the time
class Time_passed {
    constructor(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.add(0);
    }

    to_string() {
        let h = this.hours >= 10 ? this.hours : "0" + this.hours;
        let m = this.minutes >= 10 ? this.minutes : "0" + this.minutes;
        let s = this.seconds >= 10 ? this.seconds : "0" + this.seconds;

        return h + ":" + m + ":" + s;
    }

    // can be negative
    add(sec) {
        this.seconds += sec;
        while (this.seconds >= 60) {
            this.minutes++;
            this.seconds-=60
        }
        while (this.seconds < 0) {
            this.minutes--;
            this.seconds+=60;
        }
        while (this.minutes >= 60) {
            this.hours++;
            this.minutes-=60
        }
        while (this.minutes < 0) {
            this.hours--;
            this.minutes+=60
        }
    }
}

export {Time_passed};