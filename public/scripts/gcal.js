(function() {
	const calendarElement = document.querySelector('#calendar');
	const calendar = new FullCalendar.Calendar(calendarElement, {
		googleCalendarApiKey: 'AIzaSyB3vZvSfCKsxqJKxyvizJ4dS6-08JXK83M',
		events: {
			googleCalendarId: 'c_b0b26s8rrvvv4um1kin6bbsqoo@group.calendar.google.com'
		},
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,listYear'
		}
	});
	calendar.render();
}());
