// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'

console.log('This is the JavaScript entry file - your code begins here.');

// An example of how you tell webpack to use a JS file
import Chart from 'chart.js/auto';
import { allPromise } from './api-calls';
allPromise.then(data => initializeData(data));
import UserRepository from './UserRepository';
import User from './User';
import Hydration from './Hydration';
import Sleep from './Sleep';

// Global

const userGreeting = document.querySelector('#userGreeting');
const userFullName = document.querySelector('#userFullName');
const userEmail = document.querySelector('#userEmail');
const userAddress = document.querySelector('#userAddress');
const userStride = document.querySelector('#userStride');
const userFriends = document.querySelector('#userFriends');
const userStepGoal = document.querySelector('#userStepGoal');
const averageStepGoal = document.querySelector('#averageStepGoal');
const dailyHydration = document.querySelector('#dailyHydration');
const weeklyHydration = document.querySelector('#weeklyHydration');
const lastNightSleep = document.querySelector('#lastNightSleep');
const lastWeekSleep = document.querySelector('#lastWeekSleep');
const averageSleep = document.querySelector('#averageSleep');
const hydrationChart = document.querySelector('#hydrationChart');
const sleepChart = document.querySelector('#sleepChart');

function initializeData(data) {
  const userRepo = new UserRepository(data[0]);
  const randomUserNum = Math.floor(Math.random() * 50);
  const user = new User(userRepo.getUser(randomUserNum));
  renderUser(user, userRepo);
  const hydration = new Hydration(user.id, data[3]);
  renderHydration(hydration);
  const sleep = new Sleep(user.id, data[1])
  calculateSleep(sleep);
}

function renderUser(user, userRepo) {
  userGreeting.innerText = user.returnFirstName();
  userFullName.innerText = user.name;
  userEmail.innerText = user.email;
  userAddress.innerText = user.address;
  userStride.innerText = user.strideLength;
  userStepGoal.innerText = user.dailyStepGoal;
  averageStepGoal.innerText = userRepo.averageStepGoal();
  userFriends.innerHTML = addFriends(user, userRepo);
}

function calculateSleep(data) {
  const lastNightQuality = data.getDailySleepQuality(getTodaysDate());
  const lastNightDuration = data.getDailyHoursSlept(getTodaysDate());
  const lastWeekQuality = data.calculateSleepQualityWeek(getTodaysDate());
  const lastWeekDuration = data.calculateHoursSleptWeek(getTodaysDate());
  const averageQuality = data.getAverageSleepQuality();
  const averageDuration = data.getAverageHoursSlept();
  renderSleep(lastNightQuality, lastNightDuration, averageQuality, averageDuration);
  renderWeekSleep(lastWeekQuality, lastWeekDuration)
}

function renderSleep(lastNightQuality, lastNightDuration, averageQuality, averageDuration) {
  lastNightSleep.innerText = `${lastNightQuality}/5 quality & ${lastNightDuration} hours`;
  averageSleep.innerText = `${averageQuality}/5 quality & ${averageDuration} hours`;
}

function renderWeekSleep(sleepWeekQuality, sleepWeekDuration) {
  const weekDates = sleepWeekQuality.map(day => day.date);
  const weekQuality = sleepWeekQuality.map(day => day.quality);
  const weekQuantity = sleepWeekDuration.map(day => day.hours);
  makeDoubleChart(sleepChart, 'Daily Hours Slept', 'Daily Sleep Quality out of 5', weekDates, weekQuantity, weekQuality);
}

function getTodaysDate() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "/").replaceAll("2021", "2019");
}

function addFriends(user, userRepo) {
  let friendsList = user.friends;
  return friendsList.reduce((finalString, friend) => {
    return finalString += `<li class="user-friend">
    <img class="friend-img" src="https://www.abbeysurestart.com/wp-content/uploads/2021/03/blank-profile.png" alt="User Image">
    ${userRepo.getUser(friend).name}: Step Goal ${userRepo.getUser(friend).dailyStepGoal}</li>`
  }, "");
}

function renderHydration(data) {
  const dailyOunces = data.findDailyHydration(getTodaysDate());
  const weeklyOunces = data.findWeeklyHydration(getTodaysDate());
  dailyHydration.innerText = dailyOunces;
  const weekOunces = weeklyOunces.map(day => day.numOunces);
  const weekDates = weeklyOunces.map(day => day.date);
  makeSingleChart(hydrationChart, 'Daily Number of Ounces', weekDates, weekOunces);
}

function makeSingleChart(htmlElement, chartName, xLabels, data) {
var myChart = new Chart(htmlElement, {
    type: 'bar',
    data: {
        labels: xLabels,
        datasets: [{
            label: chartName,
            data: data,
            backgroundColor: 'rgb(187, 92, 255)',
            borderColor: 'rgb(232, 232, 232)',
            borderWidth: 2
        }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "rgb(232, 232, 232)",
          }
        }
      },
        scales: {
            y: {
              ticks: {
                color: "rgb(232, 232, 232)",
              },
              beginAtZero: true
            },
            x: {
              ticks: {
                color: "rgb(232, 232, 232)",
              }
            }
        }
    }
});
}

function makeDoubleChart(htmlElement, quantityLabel, qualityLabel, xLabels, quantityData, qualityData) {
var otherChart = new Chart(htmlElement, {
    data: {
        datasets: [{
            type: 'bar',
            label: qualityLabel,
            data: qualityData,
            backgroundColor: 'rgb(255, 87, 27)',
            borderColor: 'rgb(232, 232, 232)',
            borderWidth: 2,
            yAxisID: 'y1'

          }, {
            type: 'bar',
            label: quantityLabel,
            data: quantityData,
            backgroundColor: 'rgb(187, 92, 255)',
            borderColor: 'rgb(232, 232, 232)',
            borderWidth: 2, 
            yAxisID: 'y2'
        }],
        labels: xLabels
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "rgb(232, 232, 232)",
          }
        }
      },
        scales: {
            y1: {
              ticks: {
                color: "rgb(255, 129, 83)",
              },
              beginAtZero: true,
              type: 'linear',
              position: 'left',
              title: {text: 'Sleep Quality',
              display: true, color: 'rgb(232, 232, 232)'}
            },
            y2: {
              ticks: {
                color: "rgb(254, 138, 254)",
              },
              beginAtZero: true,
              type: 'linear',
              position: 'right',
              title: {text: 'Hours Slept',
              display: true, color: 'rgb(232, 232, 232)'}
            },
            x: {
              ticks: {
                color: "rgb(232, 232, 232)",
              },
              title: {text: 'Recent Week',
              display: true, color: 'rgb(232, 232, 232)'}
            }
        }
    }
});
}
