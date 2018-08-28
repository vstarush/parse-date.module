"use strict";

var moment = require('moment');

function toTimeString(data){
    var year = parseInt(new moment().format("YYYY")),
        timeString = "",
        timeStringArr = ["Jan 01"," ",year," ","12",":","00"," ","AM"];

    var ordinalTemplate = new RegExp(/\d{1,2}(?:st|nd|rd|th)/),
        monthDateTemlate = new RegExp(/(\d{1,2}\s(?:January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|Sept|October|Oct|November|Nov|December|Dec))|((?:January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|Sept|October|Oct|November|Nov|December|Dec)\s\d{1,2})/),
        timeTemplate = new RegExp(/(\d{1,2}(\S\d{2}|)(\s|)(?:am|pm|a.m|p.m))/i);
    
    if (data.search(year) >= 0) {
        data = data.replace(year,"");
    }
    else if (data.search(year + 1) >= 0) {
        timeStringArr[2] = year + 1;
        data = data.replace(year + 1,"");
    }
    
    if (data.search(ordinalTemplate) >= 0) {
        var digitData = ordinalTemplate.exec(data)[0].replace(/(st|nd|rd|th)/,"");
        data = data.replace(ordinalTemplate,digitData);
    }
    
    if (data.search(monthDateTemlate) >= 0) {
        var monthDate = monthDateTemlate.exec(data);
        timeStringArr[0] = monthDate[0];
        data = data.replace(monthDate[0],"");
    }
    
    if (data.search(timeTemplate) >= 0) {
        var tempTime = timeTemplate.exec(data);
        
        if (tempTime[0].search(":") >= 0) {
            var timeArray = tempTime[0].split(":");
            timeStringArr[4] = timeArray[0];
            
            var tempMinutes = new RegExp(/\d{1,2}/).exec(timeArray[1]);
            timeStringArr[6] = tempMinutes[0];
            
            var dayPart = timeArray[1].replace(tempMinutes[0],"");
            
            if (data.search(/a.m/i) >= 0) {
                timeStringArr[8] = "AM";
            }
            else if (data.search(/p.m/i) >= 0) {
                timeStringArr[8] = "PM";
            }
            else {
                timeStringArr[8] = dayPart.replace(" ","");
                if (timeStringArr[8] === 'a' || timeStringArr[8] === 'p') {
                    timeStringArr[8] = timeStringArr[8] + 'm';
                }
            }
        }
        else {
            var tempHours = new RegExp(/\d{1,2}/).exec(tempTime[0]);
            timeStringArr[4] = tempHours[0];
            
            var dayPart = tempTime[0].replace(tempHours[0],"");

            if (data.search(/a.m/i) >= 0) {
                timeStringArr[8] = "AM";
            }
            else if (data.search(/p.m/i)>=0) {
                timeStringArr[8] = "PM";
            }
            else {
                timeStringArr[8] = dayPart.replace(" ","");
                if (timeStringArr[8] === 'a' || timeStringArr[8] === 'p') {
                    timeStringArr[8] = timeStringArr[8] + 'm';
                }
            }
        }
    }
    
    for (var i=0; i<timeStringArr.length; i++) {
        timeString = timeString + timeStringArr[i];
    }
    
    return timeString;
}

function parseDate(dateString) {
    var dateTimeString = "";

    if (!dateString) {
        return ;
    }

    if (moment(new Date(dateString)).isValid()===true) {
        dateTimeString = moment(dateString).format('x');
        return dateTimeString;
    }
    else if (moment.utc(new Date(dateString)).isValid()===true) {
        dateTimeString = moment(dateString).format('x');
        return dateTimeString;
    }
    else {
        dateString = toTimeString(dateString);
        dateTimeString = moment(dateString).format('x');
        return dateTimeString;
    }
    
    return false;
};

module.exports = parseDate;