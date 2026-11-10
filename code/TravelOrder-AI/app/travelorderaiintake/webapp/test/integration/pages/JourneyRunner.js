sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"travelorderaiintake/test/integration/pages/BookingRequestsList.gen",
	"travelorderaiintake/test/integration/pages/BookingRequestsObjectPage.gen"
], function (JourneyRunner, BookingRequestsListGenerated, BookingRequestsObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('travelorderaiintake') + '/test/flp.html#app-preview',
        pages: {
			onTheBookingRequestsListGenerated: BookingRequestsListGenerated,
			onTheBookingRequestsObjectPageGenerated: BookingRequestsObjectPageGenerated
        },
        async: true
    });

    return runner;
});

