Feature: User login

  As a registered user
  I want to log in
  So that I can access the activity page

  Scenario: User logs in with valid credentials
    Given the user is on the login page
    When the user enters valid email and password
    And submits the login form
    Then the user is redirected to the activity page
