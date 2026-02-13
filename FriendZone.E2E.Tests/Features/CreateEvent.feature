Feature: Create activity

  As a logged in user
  I want to create a new activity
  So that other users can discover and join it

  Scenario: User creates a new activity from the activity page
    Given the user is logged in
    And the user is on the activity page
    When the user navigates to create activity
    And the user fills in the activity form with valid data
    And submits the activity
    Then the activity is created successfully with status 201