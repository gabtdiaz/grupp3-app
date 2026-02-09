Feature: Create activity

  As a logged in user
  I want to create a new activity
  So that it appears in the activity list

  Scenario: User creates a new activity from the activity page
    Given the user is logged in
    And the user is on the activity page
    When the user navigates to create activity
    And the user fills in the activity form with valid data
    And submits the activity
    Then the activity is created successfully
    And the user is redirected back to the activity page
    And the new activity is visible in the activity list
