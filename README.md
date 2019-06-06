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

# 6. Design based on Non-Functional Requirements

## 6.1. Architectural patterns and best practices on the Application

## 6.2. Architectural patterns and best practices on the System

## 6.3. Project Strategies

## 6.4. Design Decisions

## 6.5. Tools Definition
