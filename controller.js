const puppeteer = require('puppeteer');
const fs = require('fs-extra');

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

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
  
(async function hello() {
  try {
    let creds = fs.readJsonSync("./creds.json");
    let username = creds.username;
    let password = creds.password;
    let date = process.argv[2];
    let time = process.argv[3];
    let hr = Number(process.argv[4]);
    let min = Number(process.argv[5]);
    let sec = Number(process.argv[6]);
    let gym = (process.argv[7] === "arc") ? 0 : 1;
    let flag = (process.argv[8] === "t") ? false : true;
    let r = (process.argv[8] === "r") ? true : false;
    const browser = await puppeteer.launch({ headless: flag });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1600 });
    await page.goto('https://portal.recreation.ubc.ca/sso/index.php');
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.btn');
    await page.waitForSelector(`.subsection-header-text`, { timeout: 300000 });
    await page.click(`[href="/Contacts/BookMe4?widgetId=15f6af07-39c5-473e-b053-96653f77a406"]`);
    await page.waitForSelector(".bm-box-title");
    await page.waitForSelector(`a.bm-category-calendar-link.enabled`);
    await page.evaluate((gym) => { document.querySelectorAll("a.bm-category-calendar-link.enabled")[gym].click() }, gym);
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.evaluate((date, time) => {
      let allSlots = document.querySelectorAll(".bm-class-container");
      let slot = [...allSlots].filter((el) => {
        return ((el.childNodes[3].childNodes[3].childNodes[1].onclick.toString().includes(`Date=${date}`))
          && (el.childNodes[5].childNodes[1].childNodes[0].textContent.includes(time)));
      });
      slot[0].childNodes[3].childNodes[3].childNodes[1].click();
    }, date, time);
    await page.waitForSelector(".bm-course-primary-event-name.bm-event-name-h1");
    if (r) {
      await page.evaluate((hr, min, sec) => {
        let book = (hours, minutes, seconds) => {
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
    
          if (now.getHours() > hours ||
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
            // sleep(500);
            // clickRegister();
          }, timeout);
        }
        book(hr, min, sec);

      }, hr, min, sec);
    }
    // sleep(20000);
    // await page.mouse.click(897, 174);

    await page.waitForFunction(
      () => {
        if (document.querySelector('.bm-button.bm-book-button') === null || document.querySelector('.bm-button.bm-book-button') === undefined) {
          return false;
        } else {
          if (document.querySelector('.bm-button.bm-book-button').innerText.includes("REGISTER NOW")) {
            return true;
          } else {
            return false;
          }
        }
      }
      , { timeout: 0 });
    
    await page.click('.bm-button.bm-book-button');
    await page.waitForFunction(
      () => {
        if (document.querySelector('label[for="ParticipantsFamily_FamilyMembers_0__IsParticipating"]') === null || document.querySelector('section.bm-booking-info.bm-restrictions') === null) {
          return false;
        } else {
          return true;
        }
      }
      , { timeout: 300000 });
    await page.evaluate(() => {
      document.querySelector('a[title="Next"]').click();
    });
    await page.waitForFunction(
      () => {
        if (document.querySelector('strong') === null) {
          return false;
        } else {
          if (document.querySelector('strong').innerText.includes("PROGRAM WAIVER")) {
            return true;
          } else {
            return false;
          }
        }
      }
      , { timeout: 300000 });
    sleep(2000);
    await page.evaluate(() => {
      document.querySelector('a[title="Next"]').click();
    });
    await page.waitForFunction(
      () => {
        if (document.querySelectorAll('span')[27] === null || document.querySelectorAll('span')[27] === undefined) {
          return false;
        } else {
          if (document.querySelectorAll('span')[27].innerText.includes("Modify Booking")) {
            return true;
          } else {
            return false;
          }
        }
      }
      , { timeout: 300000 });
    await page.click("#checkoutButton");
    sleep(10000);
    await page.mouse.click(155, 452);
    await page.waitForFunction(() => {
      if (document.querySelector('h1.h1') === null || document.querySelector('h1.h1') === undefined) {
        return false;
      } else {
        if (document.querySelector('h1.h1').innerText.includes("Thank you!")) {
          return true;
        } else {
          return false;
        }
      }
    });
    sleep(10000);
    await browser.close();
  } catch (e) {
    console.log("something went wrong, you slot may or may not have been booked");
  }
})();