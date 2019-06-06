# **Project 4 GPS Track**

The app lets the user keep track of his location and then see the route he made.

### Access the app in: https://d3jajpkbjf11oj.cloudfront.net/

# 1. Team
### Camila White Romero - cwhiter@eafit.edu.co
### Ronald Cardona Martínez - rcardo11@eafit.edu.co
### Ricardo Rafael Azopardo Cadenas - rrazopardc@eafit.edu.co
### Alex Montoya Franco - amonto69@eafit.edu.co

# 2. Roles and Responsabilities

* Camila: Amazon Cognito - User Pool
* Ronald: Amazon API Gateway - AWS Lambda - Amazon DynamoDB
* Ricardo: Amazon API Gateway - AWS Lambda - Amazon S3
* Alex: Amazon CloudFront - Amazon DynamoDB

# 3. [Github](https://github.com/ronaldKM98/project4gps) ** Private **

# 4. Non-Functional Requirements

## 4.1. Availability

* Amazon CloudFront allowed the project to have high availability because copies of the files (also known as objects) are now held (or cached) in multiple edge locations around the world.

* Lambda runs the functions/microservices on high-availability compute infrastructure and performs all the administration of the compute resources, including server and operating system maintenance, capacity provisioning and automatic scaling, code and security patch deployment, and code monitoring and logging [1](https://aws.amazon.com/lambda/features/?nc1=h_ls).

## 4.2. Performance

* When a user requests content serving with CloudFront, the user is routed to the edge location that provides the lowest latency (time delay), so that content is delivered with the best possible performance. CloudFront speeds up the distribution of the content by routing each user request through the AWS backbone network to the edge location that can best serve the content [2](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html).

## 4.3. Security

* Two Factor Authentication: When a user register in the website, he/she will receive an email with a link that he/she has to click on in order to complete the registration process.

* User tokens: Although the user receive an unique id when he/she has registered in the website he/she needs to be logged in to be able to use the services, because they need the user id and some tokens from the user that are only available when he/she is logged in. 

* Services Authorizacion: The services only can be accessed through Amazon API Gateway which needs the permission from Amazon Cognito.

# 5. Redesign of Project 1
Aspects improved from the original project

## Project 1 Overview

![](Architectural_Overview_Project1.png) 

## Project 4 Overview

![](Architectural_Overview_Project4.png) 

# 6. Design based on Non-Functional Requirements (Availability, Performance, Security)

## 6.1. Architectural and Scalability patterns and best practices on the Application and System.

* MicroServices Oriented Architecture
* Serverless Architecture

* Recommended Practices from AWS: https://d36cz9buwru1tt.cloudfront.net/es/whitepapers/AWS_Cloud_Best_Practices.pdf

- Decouple its components.
- Keep the dynamic data closer to the computer structure and the static data closer to the end user.
- Protect data in transit.

* Scalability patterns

- Event Driven Architecture Pattern.
- Service Oriented Architecture Pattern 
- Worload/demand distribution
- Data Pull Pattern

* Scalability Best Practices

- Stateless session

* Support from Dimensions of Scalability

- Load Scalability.
- Functionality Scalability.
- Integration Scalability.
- Geographic Scalability.

## 6.2. Project Strategies

* Identify project 1 services and how we are addressing each one.
* Identify Non-Functional Requirements for project 4.
* Define the architectonic style and cloud provider.
* Define the type of cloud technologies (SaaS, PaaS, IaaS).
* Select Amazon Services to address each service from project 1.
* Divide each service and develop its functionality.
* Communicate services and consolidate the web application.
* Make load  functional tests and measure performance.

## 6.3. Design Decisions

### Design based on Microservices (Stateless)

These are the Microservices of the web application.

#### Lambda Functions:

Each service has a Header called Authorization which need a Json Web Token (JWT) from an user who is logged in that moment.

* AllRoutes [POST]: 
Receive an Id from the user who is logged in and Retrieve all the routes that are related with that user.
URL: https://hfvk7rmxbl.execute-api.us-east-2.amazonaws.com/dev/allroutes

* GetRoute [POST]: 
Receive an Id of a route and Retrieve all the points from that route.
URL: https://hfvk7rmxbl.execute-api.us-east-2.amazonaws.com/dev/getroute

* NewPoint [POST]: 
Receive the parameters Latituted, Longitude, Route_Id and save those points [Latitude, Longitude] in that Route_Id.
URL: https://hfvk7rmxbl.execute-api.us-east-2.amazonaws.com/dev/newpoint

* NewRoute [POST]: 
Receive the Route's name and save the route in the database, finally, retrieve the identifier of the route.
URL: https://hfvk7rmxbl.execute-api.us-east-2.amazonaws.com/dev/newroute


#### Cognito Services: 

* Log in:
Verifies the login and get tokens to authorize services.

* Log out:
Disable tokens.

* Register:
Creates an user on the Cognito User Pool and assign an unique id, besides, registers if the user confirm the account via email.

### Serverless Computing
Big change from project 1, in this case the project does not have a server, we have functions running as Lambda functions and services communicate with Amazon Cognito.

### Front-end and back-end decoupled
Static content is hosted on Amazon S3 and the Back-end is developed with Amazon Lambda.

## 6.4. Tools Definition

### 6.4.1. Amazon CloudFront: https://aws.amazon.com/cloudfront/
### 6.4.2. Amazon S3: https://aws.amazon.com/s3/
### 6.4.3. Amazon Cognito: https://aws.amazon.com/cognito/
### 6.4.4. Amazon API Gateway: https://aws.amazon.com/api-gateway/
### 6.4.5. AWS Lambda: https://aws.amazon.com/lambda/
### 6.4.6. Amazon DynamoDB: https://aws.amazon.com/dynamodb/
