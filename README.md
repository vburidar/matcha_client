# SeeYou / Matcha

## What is Matcha?

**Matcha** is a school project at 42 Paris. The objective of this project is to create a fully working dating website from scratch.

## What is SeeYou?

**SeeYou** is the name we choose for our own version of **Matcha**.

## Where can I see the website?

The website is accessible at seeyou.victorburidard.com. We added an algorithm that populate the databases with fake profiles so you can browse it and explore the different functionalities. 

All the profile have **Firstname_LASTNAME** as login and the well secured **Qwerty123** as password so you can test it easily. Examples of login and password combinations are provided on the Signin page of the website.

You can also create your own account.
# Technical Specificities

You are here in the git repository for the **client part** of SeeYou. If you wish to check out the **api side** of our project, you can go [here](https://github.com/vburidar/matcha_api)

The client part of our project is coded in **React** with the **Hooks** functionalities. We also used **NextJs** especially for the Router, the Links between our pages and for the GetInitialProps function that allow us to load all the data we need from the Node server before rendering the page.

To improve the aspects of our pages and components, we used the graphic library **Material UI**.

# Pages

## Signin 
Here you can connect to your account if it has been previously created and validated.

## Signup
Here you can create a new account. You will receive an email when signup is completed in order to validate your account.

## Complete-profile
When you log in for the first time, you won't be able to access to the functionalities of the site until you fill in complementary informations such as birthdate, gender, sexual preference. You will also have to add a picture and a localisation to your profile.

## Homepage

### Suggestion list
The Homepage will display a list of profiles that are relevant to your own profile. There are strict criteria and soft criteria. The strict criteria are :
- User should be less than 20 kilometers away.
- User should have at least one common interest with your profile.
- You should correspond to the sexual preference of those profiles and they should match your sexual preference.

Soft criteria are used to compute a matching score. This matching score allows us to rank the profile from most relevant to less relevant:
 - Distance in kilometers
 - Number of common interests.
 - Popularity: ratio of received likes / given likes + match / given_likes.
 - Age difference.

### Option panel
On the Homepage, you have an option panel with two main features:
 - Filtering and ordering. With this tool you can filter and order the list of suggested users provided by our matching algorithm.
 - Search tool. With this tool, you can launch a custom search on our whole database of users.

## Settings
On this page, you can update your personal informations. You can also add a picture and change your localisation.

## My profile
On this page, you can see how other users see your own profile.

## Chat
On this page, you can see all the users you can chat with and the last message you sent them or they sent you. You can also access a specific chat room with these users.

## Activity
On the activity page are displayed the following activities:
- The visits you received.
- The likes you received.
- The matches you were part.
