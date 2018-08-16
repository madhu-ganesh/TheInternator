# The Internator
The Internator is a web application that helps interns manage their hours, keep track of their pay and a record of their day-to-day activities that are pending and completed.

## Author(s)
* **Madhumeta Ganesh**

## Key Features
* The application records how many hours the user has worked so far in the week.

* It will calculate bi-weekly paychecks and alert user when it is payday.

* It will have a “To-Do” list of what issues user needs to solve for the next day/next week and will have the ability to mark items that are completed on that list.

* As the user marks items he/she has completed, they will populate the “Accomplished tasks” list which can be used as a report for the weekly meeting.

## Built with
* Bootstrap front-end template + HTML/CSS + JavaScript
* Express.js + Node.js
* SQLiteStudio Database

## How to build, install and run this application
Begin by cloning the git repository:
```
git clone https://github.com/madhu-ganesh/TheInternator
```

Subsequently, navigate to the cloned folder and download all the dependencies or packages required for the application by using the command:
```
npm install
```

Start the server using:
```
node app.js
```
Now open http://localhost:8081 on your web browser and you can get started with using the application: 
1. In the *Schedule* section of the page, you can input the hours worked every day or at the end of the week and click on "Save" to load them into the database
2. In the *Pay* section of the page, your current bi-weekly cheque amount so far will be displayed. User will be alerted when it is payday when they click on the Pay tab in the upper right-hand corner.
3. In the *To-do List* section of the page, new tasks that need to be completed can be added and removed, at your convenience. If you are finished with a task, just click on it and a line will appear across the task and populate the *Accomplished Tasks* list.
4. In the *Accomplished Tasks* section of the page, tasks that are completed will show up in list format.

Note: After following the above instructions, if running the command "node app.js" does not give you the message "go ahead and open http://localhost:8081 in your browser", then try running all following commands:
* npm install express
* npm install sqlite3
* npm install socket.io

## License
This project is licensed under Copyright © MIT License and Copyright (c) 2013-2018 Blackrock Digital LLC. The [LICENSE] (https://github.com/madhu-ganesh/TheInternator/blob/master/LICENSE) file has details regarding my project's license. The front-end template is taken from [https://startbootstrap.com/template-overviews/creative/](https://startbootstrap.com/template-overviews/creative/) with the theme name "Creative".

## Contact Information
The project was initiated and is maintained by myself, Madhumeta Ganesh. I can be reached at mganesh at pdx dot edu. Please report any bugs via the Issue Tracker at [https://github.com/madhu-ganesh/TheInternator/issues](https://github.com/madhu-ganesh/TheInternator/issues)

## Presentation
More information can be found in my powerpoint presentation slides at: https://github.com/madhu-ganesh/TheInternator/blob/master/Presentation%20files/Madhumeta_Ganesh_Internator_compressed.pptx

## Work in Progress
* Some issues with pushing tasks to the database that are being fixed

* The app will give suggestions of when he/she could complete the remaining hours (this will be done by synching his/her Google calendar with the app to know free timings, class schedule, etc).

* The app will have a Settings tab where users will be able to configure how many hours they are expected to work during a week, what is their hourly pay and the date of their next bi-weekly cheque (currently these values are hard-coded).

## Future Work
* The app will have the functionality of adding deadlines for items on the “To-Do” list and send appropriate reminder emails as the time to accomplish this task gets closer.

* It will send an email to his/her manager when a task is completed to keep manager in the loop.

* This can also be made into a multi-user app by having login, adding the ability to form teams on the app where people in the same team can provide feedback to each others' tasks.
