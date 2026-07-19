Feature: ParaBank login
  As a ParaBank customer
  I want to log in securely
  So that I can access my accounts

  Scenario: Successful login with valid credentials
    Given I am on the ParaBank login page
    When I log in with valid credentials
    Then I should see the account overview

  Scenario: Login fails with invalid credentials
    Given I am on the ParaBank login page
    When I log in with invalid credentials
    Then I should see a login error message

  Scenario: User logs out successfully
    Given I am on the ParaBank login page
    When I log in with valid credentials
    And I log out
    Then I should see the login form

  Scenario: Login page shows validation when fields are empty
    Given I am on the ParaBank login page
    When I log in with empty credentials
    Then I should see a login error message
