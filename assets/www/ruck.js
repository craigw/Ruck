$(document).ready(function() {
  /** 
  * Get the ISO week date week number
  * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html 
  */  
  Date.prototype.getWeek = function () {  
    // Create a copy of this date object  
    var target  = new Date(this.valueOf());  

    // ISO week date weeks start on monday  
    // so correct the day number  
    var dayNr   = (this.getDay() + 6) % 7;  

    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);  

    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    var jan4    = new Date(target.getFullYear(), 0, 4);  

    // Number of days between target date and january 4th  
    var dayDiff = (target - jan4) / 86400000;    

    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    var weekNr = 1 + Math.ceil(dayDiff / 7);    

    return weekNr;    
  }
  
  var ScheduledSession = function ScheduledSession(date, session) {
    this._date = date;
    this._session = session;
    this.startDate = function startDate() {
      return this._date;
    }
    this.endDate = function endDate() {
      return new Date(this._date.getTime() + this._session.length());
    }
    this.toHTML = function toHTML(week_number, day_number) {
      return '<div data-role="page" id="week_' + week_number + '_day_' + day_number + '" class="session"><div data-role="header"><h3>Week ' + week_number + ' - Day ' + day_number + '</h1></div><div data-role="content" class="content"><p class="instructions">' + this._session.instructions() + '</p><p><div class="segment_time"></div><div class="total_time"></div></p><p><a data-role="button" data-theme="b" class="start">Start</a></p></div><div data-role="footer"><h4>Ruck!</h4></div></div>';
    }
  }

  var TrainingSchedule = function TrainingSchedule(programme, scheduler) {
    this._programme = programme;
    this._scheduler = scheduler;

    this.sessions = function sessions() {
      var sessions = this._programme.trainingSessions();
      var schedule = [];

      while(sessions.length != 0) {
        var session = sessions.shift();
        var date = scheduler.schedule(session, schedule);
        schedule.push(new ScheduledSession(date, session));
      };
      return schedule;
    }
  }

  var TrainingProgramme = function TrainingProgramme(name, description) {
    this._name = name;
    this._description = description;
    this._training_sessions = [];

    this.addTrainingSession = function addTrainingSession(training_session) {
      this._training_sessions.push(training_session);
    }
    this.trainingSessions = function trainingSessions() {
      return this._training_sessions.slice(0);
    }
  }

  var TrainingSession = function TrainingSession(segments) {
    this._segments = segments;
    this.warmupTime = function warmupTime() { return 300; }
    this.cooldownTime = function cooldownTime() { return 300; }
    this.length = function length() {
      var total = this.warmupTime();
      $.each(this._segments, function(index, segment) {
        total += segment
      });
      total += this.cooldownTime();
      return total;
    }
    this._sessionInstructions = function _sessionInstructions() {
      var sessions = [];
      var subsegment_count = 0;
      $.each(this._segments, function(index, segment) {
        var minutes = (segment / 60);
        var plural = minutes == 1 ? '' : 's';
        var activity = (index % 2 == 0 ? 'running' : 'walking');
        sessions.push('<li class="segment" data-duration="' + segment + '">' + minutes + ' minute' + plural + ' ' + activity + '</li>');
      });
      return sessions.join('');
    }
    this.instructions = function instructions() {
      var s = '<ul class="segments"><li class="segment" data-duration="300">Brisk 5 minute walk to warmup</li>';
      s += this._sessionInstructions();
      s += '<li class="segment" data-duration="300">5 minute walk to cool down</li></ul>';
      return s;
    }
  }

  // The Couch to 5k TrainingProgramme is a great way to get started.
  var c25k = new TrainingProgramme("c25k", "Couch to 5k");
  // Week 1
  c25k.addTrainingSession(new TrainingSession([ 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60 ]));
  c25k.addTrainingSession(new TrainingSession([ 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60 ]));
  c25k.addTrainingSession(new TrainingSession([ 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60, 90, 60 ]));
  // Week 2
  c25k.addTrainingSession(new TrainingSession([ 90, 120, 90, 120, 90, 120, 90, 120, 90, 120, 90 ]));
  c25k.addTrainingSession(new TrainingSession([ 90, 120, 90, 120, 90, 120, 90, 120, 90, 120, 90 ]));
  c25k.addTrainingSession(new TrainingSession([ 90, 120, 90, 120, 90, 120, 90, 120, 90, 120, 90 ]));
  // Week 3
  c25k.addTrainingSession(new TrainingSession([ 90, 90, 180, 180, 90, 90, 180 ]));
  c25k.addTrainingSession(new TrainingSession([ 90, 90, 180, 180, 90, 90, 180 ]));
  c25k.addTrainingSession(new TrainingSession([ 90, 90, 180, 180, 90, 90, 180 ]));
  // Week 4
  c25k.addTrainingSession(new TrainingSession([ 180, 90, 300, 150, 180, 90, 300 ]));
  c25k.addTrainingSession(new TrainingSession([ 180, 90, 300, 150, 180, 90, 300 ]));
  c25k.addTrainingSession(new TrainingSession([ 180, 90, 300, 150, 180, 90, 300 ]));
  // Week 5
  c25k.addTrainingSession(new TrainingSession([ 300, 180, 300, 180, 300 ]));
  c25k.addTrainingSession(new TrainingSession([ 480, 300, 480 ]));
  c25k.addTrainingSession(new TrainingSession([ 1200 ]));
  // Week 6
  c25k.addTrainingSession(new TrainingSession([ 300, 180, 480, 180, 300 ]));
  c25k.addTrainingSession(new TrainingSession([ 600, 180, 600 ]));
  c25k.addTrainingSession(new TrainingSession([ 1500 ]));
  // Week 7
  c25k.addTrainingSession(new TrainingSession([ 1500 ]));
  c25k.addTrainingSession(new TrainingSession([ 1500 ]));
  c25k.addTrainingSession(new TrainingSession([ 1500 ]));
  // Week 8
  c25k.addTrainingSession(new TrainingSession([ 1800 ]));
  c25k.addTrainingSession(new TrainingSession([ 1800 ]));
  c25k.addTrainingSession(new TrainingSession([ 1800 ]));
  // Week 9
  c25k.addTrainingSession(new TrainingSession([ 1920 ]));
  c25k.addTrainingSession(new TrainingSession([ 1920 ]));
  c25k.addTrainingSession(new TrainingSession([ 1920 ]));

  // TODO: Implement a custom scheduler so people can pick which days they can run.
  var BasicScheduler = function BasicScheduler() {
    this.schedule = function schedule(session, currentSchedule) {
      if(currentSchedule.length > 0) {
        var previousSession = currentSchedule[currentSchedule.length - 1];
        var lastTime = previousSession.endDate().getTime();
        var suggested = new Date(lastTime + (86400000 * 2));
        var suggestedDay = suggested.getDay();
        if(suggestedDay == 0) {
          return new Date(suggested.getTime() + 86400000);
        } else if(suggestedDay == 7) {
          return new Date(suggested.getTime() + (86400000 * 2));
        }
        return suggested;
      } else {
        // Start on the next Monday
        return new Date((new Date()).getTime() - ((new Date()).getDay() * 86400000) + 86400000);
      }
    }
  }

  var scheduler = new BasicScheduler();
  var trainingSchedule = new TrainingSchedule(c25k, scheduler);

  var ScheduledWeek = function ScheduledWeek() {
    this._sessions = [];
    this.addSession = function addSession(session) {
      this._sessions.push(session);
    }
    this.toHTML = function toHTML(week_number) {
      var title = "Week " + week_number;
      var days = '';
      var s = '<div data-role="page" id="week_' + week_number + '" class="week"><div data-role="header"><h1>' + title + '</h1></div><div data-role="content"><ul data-role="listview">';
      $.each(this._sessions, function(index, session) {
        var day = index + 1;
        s += '<li><a href="#week_' + week_number + '_day_' + day + '">Day ' + day + '</a></li>';
        days += session.toHTML(week_number, day);
      });
      s += '</ul></div><div data-role="footer"><h4>Ruck!</h4></div></div>';
      return s + days;
    }
  }

  var ScheduleByWeekDecorator = function ScheduleByWeekDecorator(schedule) {
    this._schedule = schedule;
    this.sessions = function sessions() {
      var weeks = [];
      var sessions = this._schedule.sessions();
      while(sessions.length != 0) {
        var actualWeekNumber = sessions[0].startDate().getWeek();
        var week = new ScheduledWeek();    
        while(sessions.length != 0 && sessions[0].startDate().getWeek() == actualWeekNumber) {
          week.addSession(sessions.shift());
        }
        weeks.push(week);
      }
      return weeks;
    }
    this.toHTML = function toHTML() {
      var weeks = '';
      var s = '<div data-role="page" id="c25k"><div data-role="header"><h1>Couch to 5k</h1></div><div data-role="content"><ul data-role="listview" id="weeks">';
      $.each(this.sessions(), function(index, session) {
        var week_number = index + 1;
        s += '<li><a href="#week_' + week_number + '">Week ' + week_number + '</a></li>';
        weeks += session.toHTML(week_number);
      });
      s += '</ul></div><div data-role="footer"><h4>Ruck!</h4></div></div>';
      return s + weeks;
    }
  }

  var weeklySchedule = new ScheduleByWeekDecorator(trainingSchedule);
  $("body").append(weeklySchedule.toHTML());

  var db = openDatabase("ruck", "0.1", "Ruck", 1000000);
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS sessions (name CHAR(255), completed_at DATETIME)');
  });

  $("a.start").click(function() {
    $this = $(this);
    $this.hide();
    var startAt = $.now();
	var content = $this.parents('.content');
	var segments = content.find('.segment');
	var totalTime = 0;
	var paused = false;
	$.each(segments, function(index, segment) {
	  totalTime += parseInt($(segment).attr('data-duration'));
	});
	var $totalTime = content.find('.total_time');
	var $segmentTime = content.find('.segment_time');

	var tick = function tick() {
	  var elapsedTime = ($.now() - startAt);
	  var segmentStart = 0;
	  var finished = true;
      $.each(segments, function(index, segment) {
        var $segment = $(segment);
		var segmentDuration = parseInt($segment.attr('data-duration')) * 1000;
		var segmentEnd = segmentStart + segmentDuration;
        var current = (segmentStart <= elapsedTime && elapsedTime < segmentEnd);
		if(current) {
          finished = false;
          var segmentElapsed = Math.round(((elapsedTime - segmentStart) / 1000) * 10) / 10;
          var segmentRemaining = Math.round(((segmentDuration / 1000) - segmentElapsed) * 10) / 10;
          $segmentTime.text('Segment: ' + segmentElapsed + 's / ' + segmentRemaining + 's');
          $segment.addClass('current');
		} else {
		  if($segment.hasClass('current')) {
            navigator.notification.vibrate(500)
            navigator.notification.beep(1)
            $segment.removeClass('current');
		  }
		}
		segmentStart = segmentEnd;        
      });
	  var sessionSeconds = Math.round((elapsedTime / 1000) * 10) / 10;
	  var sessionRemaining = Math.round((totalTime - sessionSeconds) * 10) / 10;
      $totalTime.text('Session: ' + sessionSeconds + 's / ' + sessionRemaining + 's');
      if(!finished && !paused) {
        // TODO: work out how long it took to perform this tick so I can more accurately work out when to time the next tick for.
        setTimeout(tick, 90);
      }
      // TODO: Remove the finished flag in favour of asking if there's any time remaining
      // TODO: If time remaining <= 0 then show zeros on the counters
      // TODO: When time remaining <= 0 then remember the session is finished
	}
	setTimeout(tick, 90);
  });
});