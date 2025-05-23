/* eslint-disable @typescript-eslint/naming-convention */

// @group:onboarding
// @retry=2

describe('Onboarding - recover wallet T2', () => {
    beforeEach(() => {
        cy.task('startBridge');
        cy.viewport(1080, 1440).resetDb();
        cy.prefixedVisit('/');
        cy.task('startEmu', { wipe: true });

        cy.getTestElement('@onboarding/continue-button').click();
        cy.getTestElement('@onboarding/continue-button').click();
        cy.getTestElement('@firmware/continue-button').click();
        cy.getTestElement('@onboarding/path-recovery-button').click();
    });

    it('Device disconnected during action', () => {
        cy.getTestElement('@onboarding/confirm-on-device');
        cy.task('pressYes');
        cy.wait(501);
        cy.task('stopEmu');
        cy.getTestElement('@connect-device-prompt', { timeout: 20000 });
        cy.task('startEmu', { wipe: false });
        cy.log(
            'If device disconnected during call, error page with retry button should appear. Also note, that unlike with T1, retry button initiates recoveryDevice call immediately',
        );
        cy.getTestElement('@onboarding/recovery/start-button', { timeout: 10000 }).click();
    });
});
