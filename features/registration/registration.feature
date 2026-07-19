Feature: ParaBank user registration
  As a prospective ParaBank customer
  I want to register an account
  So that I can use online banking

  Background:
    Given I am on the ParaBank login page
    And I navigate to the registration page

  Scenario: Successful new user registration
    When I register with unique user details
    Then I should see the registration welcome message

  Scenario: Registration fails with duplicate username
    When I register with an existing username
    Then I should see a duplicate username error
