var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Dallas";

var numberOfResults = 3;

var APIKey = "4844d21f760b47359945751b9f875877";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Dallas is a major city in the U.S. state of Texas. It is the most populous city in the Dallas–Fort Worth metroplex, the fourth most populous metropolitan area in the United States. ";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "What attraction was that? " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example, open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "The Dallas Zoo", content: "Dallas Zoo is a 106-acre zoo located 3 miles (5 km) south of downtown Dallas, Texas, in Marsalis Park.", location: "Downtown Dallas", contact: "469 554 7500" },
    { name: "The Dallas Aquarium", content: "The Dallas World Aquarium is a for-profit aquarium and zoo located in the West End Historic District of downtown Dallas, Texas, USA. ", location: "Downtown Dallas", contact: "214 720 2224" },
    { name: "The Dallas Arboretum", content: "The Dallas Arboretum and Botanical Garden is a 66-acre (267,000 m²) botanical garden located at 8617 Garland Road.", location: "East Dallas", contact: "214 515 6615" },
	{ name: "The Reunion Tower", content: "Reunion Tower is a 561 ft (171 m) observation tower and one of the most recognizable landmarks in Dallas, Texas.", location: "Downtown Dallas", contact: "214 712 7040" },
	{ name: "The Sixth Floor Museum", content: "The Sixth Floor Museum at Dealey Plaza is located on the sixth floor of the Dallas County Administration Building formerly the Texas School Book Depository.", location: "Downtown Dallas", contact: "214 747 6660" }
];

var topFive = [
    { number: "1", caption: "Visit the Reunion Tower and see Dallas from  above.", more: "Once the tallest structures in Dallas, The Reunion Tower is an observation tower that reaches a height of 561 feet. The Restaurant falls slightly below this, offering views.", location: "Downtown Dallas", contact: "214 712 7040" },
    { number: "2", caption: "Get shopping at stonebriar Mall.", more: "Stonebriar Centre is a mid-range shopping mall located at the intersection of Preston Road and the Sam Rayburn Tollway in Frisco, Texas.", location: "Frisco", contact: "972 668-6255" },
    { number: "3", caption: "Earn your  wings at the Cavanaugh Flight Museum.", more: "The Cavanaugh Flight Museum is an aviation museum with a non-profit 501 status for aviation educational", location: "Addison", contact: "972 380 8800" },
    { number: "4", caption: "Breathe in the culture  at the Dallas Museum of Art.", more: "he Dallas Museum of Art (DMA) is a major art museum located in the Arts District of downtown Dallas Texas.", location: "Downtown Dallas", contact: "214 922 1200" },
    { number: "5", caption: "Take a spin on the Texas Star.", more: "Texas Star is a Ferris wheel at Fair Park in Dallas, Texas, where it operates during the annual State Fair of Texas and is the most popular ride.", location: "South Dallas", contact: "214 426 3400" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':tellWithCard', output, output, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = 0;
        if(this.event.request.intent.slots.attraction ) {
            if (this.event.request.intent.slots.attraction.value) {
                slotValue = this.event.request.intent.slots.attraction.value;

            }
        }

        if (slotValue > 0 && slotValue <= topFive.length) {

            var index = parseInt(slotValue) - 1;
            var selectedAttraction = topFive[index];

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};


function httpGet(query, callback) {
    console.log("/n QUERY: "+query);

    var options = {
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

            var body = '';

    res.on('data', (d) => {
        body += d;
});

    res.on('end', function () {
        callback(body);
    });

});
    req.end();

    req.on('error', (e) => {
        console.error(e);
});
}


