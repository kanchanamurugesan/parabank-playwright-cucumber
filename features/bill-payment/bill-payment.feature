Feature: ParaBank bill payment
  As a ParaBank customer
  I want to pay bills online
  So that I can manage my payments

  Background:
    Given I am on the ParaBank login page
    When I log in with valid credentials

  Scenario: Successful bill payment with valid payee details
    When I submit a bill payment with valid payee details
    Then I should see the bill payment confirmation

  Scenario: Bill payment fails with incomplete payee details
    When I submit a bill payment with incomplete payee details
    Then I should see bill payment validation errors
