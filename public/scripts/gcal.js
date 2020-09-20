(function() {
	const calendarElement = document.querySelector('#calendar');
	const calendar = new FullCalendar.Calendar(calendarElement, {
		googleCalendarApiKey: 'AIzaSyC6PvTXIr72umSHtDLbPR2C-IAHkxMRyPc',
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
