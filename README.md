SimpleCheckIn
=============

Simple browser based child check in system for tracking when a child is dropped off and picked up and what guardian is responsible/allowed to do so.

We created this to help small churches and other organizations put into place a simple check in / check out procedure to better protect their children.

***
Installation:

Database:
*Simple Checkin was developed using a MySQL database. The 'checkin.sql' file will build your databse structure for you.*
1.   Login to phpMyAdmin and create a new database called 'checkin'.
2.   If you would like to import the sql structure go to the Import tab, browse your computer to where you saved Simple Checkin, the click 'Go'.
3.   If you prefer to run the database structure from the sql prompt then open 'checkin.sql' in your favorite editor then copy and paste the sql code into the prompt.

Notes:
* Be sure to make sure your timezone is correctly set in your php.ini file or timestamps will be off.

***
Built using:
Slim Micro Framework - 


Front end built on Zurb's Foundation so it will work for any screen size and jQuery for handling form data and visuals.

You can install it on a server or run it on a local machine using a LAMP, MAMP or WAMP stack.


***
### To Do

* Add SQL structure file
* Set up PHP files to connect to SQL

### Contributing
If you are interested in contributing to the project please fork the project on github. https://github.com/brankindesign/SimpleCheckIn

### History

***



*Simple Check In* Copyright (c) 2012 Bryan Rankin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.