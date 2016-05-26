This is a college assignment I undertook in 3rd year
It is an web application build using NodeJS and Express

The aims of the assignment are:
1.The web site has to be mobile friendly
2.The web site has to have a secure (i.e. password protected) admin section through which the web site owner can upload content.
3.The web site has to utilise a database.
4.The code should handle scenarios such as:
o Users attempting to log in without login credentials being provided
o Users submitting forms with providing all/some of the required data
o Users attempting to access pages with the admin section without having logged in

The application is still a work in progress, but currently, it does the following:
- It allows a person to register
- It checks for a username which already exists
- It checks if passwords match
- When registering, the user must fill in all form fields
- It checks login credentials, and if they are incorrect it tells the user this
- It is responsive for desktop, mobile and tablet devices
- All users information is stored in a database using MongoDb
- It stores uploaded files in an uploads folder (currently not showing in the app or not storing in a db)

What I still need to get working
- When a user uploads a file (portfolio piece), it needs to store in a db and show on their profile page
- Send an email from the application to the register user
- Enable a user to upload videos and swf's to their profile page
