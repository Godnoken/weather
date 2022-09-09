# weather



### Live
https://godnoken.github.io/weather/

## Tech stack
HTML, CSS, JavaScript, GSAP.

## Features
Visual 2D weather <br>
Clouds <br>
Raindrops <br>
Snowflakes <br>
Changing sky <br>
Sun & moon <br>
Real time data <br>
Mobile support <br>

## Explanation
I have used real time data from the https://openweathermap.org/ api "One Call 3.0" together with the geolocation API from the same company to let users type in any location they'd like to see the current weather of. <br>

All data retrieved & displayed is based on the hour of the day. <br>

Sun & moon's position is based on the time of the day and moves in an arch (If you leave the page running, it will move to the end in real time. Although you can not switch tabs as that will its movement) <br>

Sky changes colour depending on the time of the day and cloud coverage <br>

Stars show closer to the middle of the night and the visibility depends on cloud coverage <br>

Cloud speed is based on the altitude (y-coordinate) <br>
Cloud coverage is based on the % of the sky that is filled with clouds, divided by 10, due to performance and visual reasons (1 cloud per 10%, although 13% would yield 2)<br>

Raindrops are based on the precipitation %, divided by 2 due to performance and visual reasons <br>

Snowflakes are based on the expected Snow millimeters, divided by 2 due to performance and visual reasons <br>

If a location has snow expected, it will override any rain precipitation due to performance and visual reasons <br>
