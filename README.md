# family-finance
This Node.js application, powered by Express.js, connects to both MySQL and MongoDB databases. It allows users to retrieve and add financial data for family members. 

The MySQL connection enables fetching income and expense details, while the MongoDB connection stores associated notes for each transaction. 

The app defines two endpoints: one for retrieving financial details (GET /family/:id) and another for adding new transactions (POST /family/:id/add). 

In the GET endpoint, it queries both databases to gather the necessary information and returns it as a JSON response. 

The POST endpoint allows users to add new income or expense transactions, updating the databases accordingly and responding with a success message. 

Overall, this application provides a comprehensive solution for managing family finances.


# MYSQL
The family_finance database is designed to manage the financial transactions and records of a family unit. It consists of three primary tables:

family_members Table: This table serves as the foundation of the database, storing essential information about each family member. It includes the following attributes:

member_id: A unique identifier assigned to each family member, serving as the primary key of the table.
name: The name of the family member, allowing for easy identification.
relationship: Describes the familial relationship of the member within the family unit.
incomes Table: This table records all sources of income for each family member, providing insights into their financial contributions. It comprises the following fields:

income_id: A unique identifier for each income record, serving as the primary key.
member_id: A foreign key referencing the member_id column in the family_members table, establishing a relationship between income records and family members.
amount: The monetary value of the income received by the family member.
source: Describes the origin or nature of the income source.
date: Represents the date on which the income was received.
expenses Table: This table tracks all expenditures made by family members, facilitating a comprehensive understanding of their spending habits. It includes the following attributes:

expense_id: A unique identifier for each expense record, serving as the primary key.
member_id: A foreign key referencing the member_id column in the family_members table, establishing a relationship between expense records and family members.
amount: The monetary value of the expense incurred.
category: Categorizes the expense into specific expenditure categories, aiding in financial analysis.
date: Indicates the date on which the expense occurred.
The database schema adheres to relational database principles, leveraging primary and foreign key constraints to maintain data integrity and enforce referential integrity between related tables. By organizing financial data into structured tables and establishing relationships between them, the family_finance database facilitates efficient management and analysis of the family's financial affairs.

# MongoDB

MongoDB is used to store and manage notes associated with family finances, providing flexibility and scalability for organizing financial information.
It serves as a complementary database to MySQL, storing financial notes associated with family members, offers flexibility in schema design, allowing dynamic updates and accommodating diverse data types. 
With its scalability and fault tolerance, MongoDB ensures reliable storage and retrieval of financial information, enhancing the overall robustness and performance of this application.


# Express js
In this project, Express.js acts as the backend framework, facilitating the creation of RESTful APIs for managing family financial data. 
It handles HTTP requests, routes them to appropriate endpoints, and interacts with MySQL and MongoDB databases. With its middleware support and modular architecture, Express.js enables efficient request handling, data validation, and response generation, ensuring smooth communication between the client and server components of your application.
summary of the JavaScript code used in your project:

**Dependencies and Setup:**

The project uses Express for creating a web server, MySQL for interacting with a MySQL database, and Mongoose for connecting to a MongoDB database.
**MySQL Connection:**

Establishes a connection to the MySQL database using the mysql package. If successful, it logs a message indicating the connection is established.
**MongoDB Connection:**

Connects to the MongoDB database at localhost:27017 in the family database using Mongoose.
**MongoDB Schema and Model:**

Defines a schema for storing notes related to family members. Each note can be associated with an income or an expense.
**Routes:**

Get Financial Details: Fetches income, expense, and note details for a family member by their ID.
Add Income or Expense: Allows adding new income or expense entries along with notes for a family member.

# User guide:

* Ensure Databases Are Running: Before starting, make sure that both MySQL and MongoDB servers are running on your machine.

* Start the Application: Open a terminal or command prompt, navigate to the project directory where the JavaScript files are located, and run the command node index.js.

* Interact via HTTP Requests: Once the application is running, you can interact with it by sending HTTP requests. You can do this using tools like cURL or Postman, or by writing scripts in languages like JavaScript or Python.








