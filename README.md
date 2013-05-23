# ukweathervisualisations

## D3 visualisations of UK Met Office data

This project was originally going to be Java based, but I've just discovered Node.js, and it was trivially easy
to code in that.  

At this point in time, I'm just concentrating on harvesting the data.  I'm using MongoDB, and it's reading
about 200,000 predictions for over 5000 locations.  It takes a matter of seconds to do this on my machine,
but speed isn't really an issue, so long as it can achieve it in a reasonable time frame (say, 10 minutes).

The idea behind the project is this:  The Met Office releases a prediction every three hours for every 
location in their database (about 5364 when I last looked), and up to five days in advance. When we check the 
weather for the weekend, we get one and only one of those predictions, but what we don't see is what they 
predicted about the weekend yesterday or the day before.  So how can we gauge how confident they are in that 
prediction?  They say it will be clear and sunny now, but what will they way tomorrow?  So what happens is 
that we check and check and it consumes our lives... well, some of us, anyway.  Wouldn't it be great if we 
could say with greater confidence what the weather will be like at the weekend by showing how the predictions 
haven't wavered?

This project is a bit of an exercise.  I use MongoDB in my daily life already and have done for a couple of years, 
but this gives me some more exposure to D3.js and Node.js, both of which are truly great tools.  Any comments or
collaboration would be appreciated.

### Installation

With Node.js and MongoDB installed, you can install other dependencies with 
`npm install moment`
`npm install mongodb`

Then run 

`node app.js`

Press CTRL-C to stop it.  I'll get a bit more sophisticated in future...
