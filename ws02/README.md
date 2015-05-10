To run the code:
1. node server.js csv &
This command runs server.js in the background. The cvs indicates that we are running
a csv handler
2. node client.js csv
This runs the client with the csvHandler
3. node client.js jsonUser
This runs the client with the jsonUserHandler

Whenever you run either of the above two steps it prints out people.csv, but in different
formats

In summary my code basically consists of a client side java script file, and server
side javascript file, and an input file to provide the information (people.csv).

The client requests the file from the server and the server sends it back for the
client to read and interpret.
