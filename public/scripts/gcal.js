(function() {
	const calendarElement = document.querySelector('#calendar');
	const calendar = new FullCalendar.Calendar(calendarElement, {
		googleCalendarApiKey: 'AIzaSyB3vZvSfCKsxqJKxyvizJ4dS6-08JXK83M',
		events: {
			googleCalendarId: 'fknobkesgn74fib6g0sfu1796c@group.calendar.google.com'
		},
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,listYear'
		}
	});
	calendar.render();
}());
