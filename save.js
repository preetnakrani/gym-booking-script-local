

function refreshAt(hours, minutes, seconds) {
    var now = new Date();
    var then = new Date();

    function clickRegister() {
        document.getElementsByClassName("bm-button bm-book-button")[0].click();
    }

    function sleepWhileLoad() {
        let currNum = 0;
        do {
            currNum = currNum + 1;
        } while (document.readyState !== "complete");
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }

    if(now.getHours() > hours ||
       (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(function () {
        window.location.reload(true);
        sleep(500);
        clickRegister();
    }, timeout);
}