Feature: ParaBank account management
  As a ParaBank customer
  I want to manage my accounts
  So that I can review and organize my money

  Background:
    Given I am on the ParaBank login page
    When I log in with valid credentials

  Scenario: View accounts overview after login
    When I navigate to the accounts overview
    Then I should see my account numbers

  Scenario: Open a new savings account
    When I open a new "SAVINGS" account
    Then I should see the new account confirmation

  Scenario: Open a new checking account
    When I open a new "CHECKING" account
    Then I should see the new account confirmation
