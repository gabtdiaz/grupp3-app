Feature: Register account

 Scenario: User registers successfully
    Given the user is on the register page
    When the user completes the registration form with valid details
    Then the user should be redirected to the activity page
    And the user should see the heading "AKTIVITETER"

Scenario: Registration fails when passwords do not match
    Given the user is on the register page
    When the user enters different passwords
    Then the user should see an error message
    And the user should not be redirected to the activity page

Scenario: Registration fails when email already exists
    Given the user is on the register page
    When the user registers with an email that already exists
    Then the user should see an error message about the email
    And the user should not be redirected to the activity page

Scenario: Registration fails when user is under 18
    Given the user is on the register page
    When the user enters a date of birth that makes the user under 18
    Then the user should see the error message "Du måste vara minst 18 år för att bli medlem"
    And the user should not be redirected to the activity page
