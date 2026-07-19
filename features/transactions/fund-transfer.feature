Feature: ParaBank fund transfers
  As a ParaBank customer
  I want to transfer funds between my accounts
  So that I can manage my money

  Background:
    Given I am on the ParaBank login page
    When I log in with valid credentials
    And I have at least two accounts available for transfer

  Scenario: Successful fund transfer between accounts
    When I transfer the valid amount between my accounts
    Then I should see the transfer confirmation

  Scenario: View transaction history after transfer
    When I transfer the valid amount between my accounts
    And I view the destination account activity
    Then I should see transaction history

  Scenario: Transfer fails with an invalid amount
    When I transfer an invalid amount between my accounts
    Then I should see a transfer error
