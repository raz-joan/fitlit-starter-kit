import { makeSingleChart, makeDoubleChart } from './charts.js';
import getTodaysDate from './scripts.js';
// ~~~~~used to render user and user data~~~~~
const userGreeting = document.querySelector('#userGreeting');
const userFullName = document.querySelector('#userFullName');
const userEmail = document.querySelector('#userEmail');
const userAddress = document.querySelector('#userAddress');
const userStride = document.querySelector('#userStride');
const userFriends = document.querySelector('#userFriends');
const userStepGoal = document.querySelector('#userStepGoal');
const averageStepGoal = document.querySelector('#averageStepGoal');
// ~~~~~~render Sleep Method~~~~~~~~
const lastNightSleep = document.querySelector('#lastNightSleep');
const averageSleep = document.querySelector('#averageSleep');
// ~~~~~charts~~~~~~~~~~
const sleepChart = document.querySelector('#sleepChart');
const hydrationChart = document.querySelector('#hydrationChart');
// ~~~~~~~used to render hydration~~~~~~~~
const dailyHydration = document.querySelector('#dailyHydration');
// ~~~~~~~~swivel buttons~~~~~~~~~~~
const stepCardInner = document.querySelector('#stepCardInner');
const sleepCardInner = document.querySelector('#sleepCardInner');
const hydrationCardInner = document.querySelector('#hydrationCardInner');
const activityCardInner = document.querySelector('#activityCardInner');
// ~~~~~~~~render Activity~~~~~~~~~~~
const latestSteps = document.querySelector("#latestSteps");
const todayActiveMinutes = document.querySelector("#todayActiveMinutes");
const distanceWalked = document.querySelector("#distanceWalked");
const flightsClimbed = document.querySelector("#flightsClimbed");
const allLatestSteps = document.querySelector("#allLatestSteps");
const allActiveMinutes = document.querySelector("#allActiveMinutes");
const stairsActivityChart = document.querySelector("#stairsActivityChart");
const stepsActivityChart = document.querySelector("#stepsActivityChart");
const minutesActivityChart = document.querySelector("#minutesActivityChart");

let domUpdates = {
  hideResponse(element, form) {
    element.classList.add('hidden');
    form.classList.remove('hidden');
    form.reset();
  },

  renderUser(user, userRepo) {
    userGreeting.innerText = user.returnFirstName();
    userFullName.innerText = user.name;
    userEmail.innerText = user.email;
    userAddress.innerText = user.address;
    userStride.innerText = user.strideLength;
    userStepGoal.innerText = user.dailyStepGoal;
    averageStepGoal.innerText = userRepo.averageStepGoal();
    userFriends.innerHTML = this.addFriends(user, userRepo);
  },

  addFriends(user, userRepo) {
    let friendsList = user.friends;
    return friendsList.reduce((finalString, friend) => {
      return finalString += `<li class="user-friend">
      <img class="friend-img" src="https://www.abbeysurestart.com/wp-content/uploads/2021/03/blank-profile.png" alt="User Image">
      ${userRepo.getUser(friend).name}: Step Goal ${userRepo.getUser(friend).dailyStepGoal}</li>`
    }, "");
  },

  renderSleep(lastNightQuality, lastNightDuration, averageQuality, averageDuration) {
    lastNightSleep.innerText = `${lastNightQuality}/5 quality & ${lastNightDuration} hours`;
    averageSleep.innerText = `${averageQuality}/5 quality & ${averageDuration} hours`;
  },

  renderWeekSleep(sleepWeekQuality, sleepWeekDuration) {
    const weekDates = sleepWeekQuality.map(day => day.date);
    const weekQuality = sleepWeekQuality.map(day => day.quality);
    const weekQuantity = sleepWeekDuration.map(day => day.hours);
    return makeDoubleChart(sleepChart, 'Daily Hours Slept', 'Daily Sleep Quality out of 5', weekDates, weekQuantity, weekQuality);
  },

  renderHydration(data) {
    const dailyOunces = data.findDailyHydration(getTodaysDate());
    const weeklyOunces = data.findWeeklyHydration(getTodaysDate());
    dailyHydration.innerText = dailyOunces;
    const weekOunces = weeklyOunces.map(day => day.numOunces);
    const weekDates = weeklyOunces.map(day => day.date);
    return makeSingleChart(hydrationChart, 'Daily Number of Ounces', weekDates, weekOunces);
  },

  toggleSwivel(event) {
    if (event.target.classList.contains('sleep-button')) {
      sleepCardInner.classList.toggle('swivel');
    } else if (event.target.classList.contains('hydration-button')) {
      hydrationCardInner.classList.toggle('swivel');
    } else if (event.target.classList.contains('step-button')) {
      stepCardInner.classList.toggle('swivel');
    } else if (event.target.classList.contains('activity-button')) {
      activityCardInner.classList.toggle('swivel');
    }
  },

  renderActivityMinutes(activity) {
    let today = getTodaysDate();
    todayActiveMinutes.innerText = activity.getDayActiveMins(today) + " minutes";
    allActiveMinutes.innerText = activity.getAverageActivityByDate(today, "minutesActive") + " minutes";
    allFlightsClimbed.innerText = (activity.getAverageActivityByDate(today, "flightsOfStairs"));
    const weekData = activity.getWeekRange(activity.filteredData, today);
    const weekActiveMinutes = weekData.map(day => day.minutesActive);
    const weekDates = weekData.map(day => day.date);
    return makeSingleChart(minutesActivityChart, 'Active Minutes', weekDates, weekActiveMinutes);
  },

  renderActivitySteps(activity, allUsers) {
    let today = getTodaysDate();
    latestSteps.innerText = activity.getSteps(today);
    allLatestSteps.innerText = allUsers.averageStepGoal();
    const weekData = activity.getWeekRange(activity.filteredData, today);
    const weekSteps = weekData.map(day => day.numSteps);
    const weekDates = weekData.map(day => day.date);
    return makeSingleChart(stepsActivityChart, 'Steps', weekDates, weekSteps);
  },

  renderActivityStairs(activity) {
    let today = getTodaysDate();
    distanceWalked.innerText = activity.getMiles(today) + " miles";
    flightsClimbed.innerText = activity.getStairs(today);
    allFlightsClimbed.innerText = (activity.getAverageActivityByDate(today, "flightsOfStairs"));
    const weekData = activity.getWeekRange(activity.filteredData, today);
    const weekStairs = weekData.map(day => day.flightsOfStairs);
    const weekDates = weekData.map(day => day.date);
    return makeSingleChart(stairsActivityChart, 'Stairs Climbed', weekDates, weekStairs);
  }
}

export default  domUpdates;