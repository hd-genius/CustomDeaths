const { $gameTemp } = require("./__mocks__/$gameTemp.js");
const { PluginManager } = require("./__mocks__/PluginManager.js");
require("./__mocks__/$gameTemp.js")
require("./__mocks__/$gameVariables.js")

/**
 * remove and reimport the plugin and the code that it alters so that the plugin can accept changes in the passed parameters
 */
function setupPlugin() {
    jest.resetModules();
    require("./__mocks__/Game_Battler.js");
    require("./CustomDeaths.js");
}

const afterDeathEvent = 1;
const beforeDeathEvent = 2;
const killedEntityType = 1;
const killedIdVariable = 2;

function testNonLethalDamage() {
    const realSetHp = jest.fn();
    const battler = new Game_Battler(realSetHp);
    battler.setHp(35);
    expect(realSetHp).toBeCalledWith(35);
}

function testBeforeDeathEventIsFired() {
    const battler = new Game_Battler();
    battler.setHp(0);
    expect($gameTemp.reserveCommonEvent).toBeCalledWith(beforeDeathEvent);
}

function testKilledIdVariableIsSet() {
    const battler = new Game_Battler();
    battler._index = 3;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedIdVariable, 3);
}

function testKilledActorTypeVariableSet() {
    const battler = new Game_Battler();
    battler._isEnemy = false;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedEntityType, 1);
}

function testKilledEnemyTypeVariableSet() {
    const battler = new Game_Battler();
    battler._isEnemy = true;
    battler.setHp(0);
    expect($gameVariables.setValue).toBeCalledWith(killedEntityType, 2);
}

function testNoDamageUntilBeforeDeathEventReturns() {
    fail('cannot test this behavior yet')
}

function testDamageAfterBeforeDeathEventReturns() {
    fail('cannot test this behavior yet')
}

describe('CustomDeaths plugin', () => {
    afterEach(() => {
        jest.clearAllMocks()
    });

    describe('"continue death" command', () => {
        it.todo('should be registered with the PluginManager');
    })

    describe('when a Game_Battler takes damage', () => {
        describe('when a beforeDeathEvent is provided', () => {
            beforeEach(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent: null,
                    beforeDeathEvent,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });

            it('nonlethal damage should be applied normally', testNonLethalDamage);

            it('should fire the beforeDeathEvent', testBeforeDeathEventIsFired);

            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should not let combat continue until control is returned from the beforeDeathEvent');

            it.skip('should not apply the lethal damage before control has been returned by the beforeDeathEvent', testNoDamageUntilBeforeDeathEventReturns);

            it.skip('should apply the lethal damage after control has been returned by the beforeDeathEvent', testDamageAfterBeforeDeathEventReturns);
        });

        describe('when an afterDeathEvent is provided', () => {
            beforeEach(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent,
                    beforeDeathEvent: null,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });


            it('nonlethal damage should be applied normally', testNonLethalDamage);

            it.todo('should apply damage before the afterDeathEvent is fired');

            it('should fire the afterDeathEvent', () => {
                const battler = new Game_Battler();
                battler.setHp(0);
                expect($gameTemp.reserveCommonEvent).toBeCalledWith(afterDeathEvent);
            })

            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should delay the end of the battle until the afterDeathEvent has finished running if the death would finish the battle');
        });

        describe('when a beforeDeathEvent and an afterDeathEvent are provided', () => {
            beforeEach(() => {
                PluginManager.parameters.mockReturnValue({
                    afterDeathEvent,
                    beforeDeathEvent,
                    killedIdVariable,
                    killedEntityType
                });

                setupPlugin();
            });

            it('nonlethal damage should be applied normally', testNonLethalDamage);

            it('should fire the beforeDeathEvent', testBeforeDeathEventIsFired);

            it.skip('should not apply the lethal damage before control has been returned by the beforeDeathEvent', testNoDamageUntilBeforeDeathEventReturns);

            it.todo('should apply damage before the afterDeathEvent is fired');
            
            it('should set the value of the killedEntityType variable for enemies', testKilledEnemyTypeVariableSet);

            it('should set the value of the killedEntityType variable for actors', testKilledActorTypeVariableSet);

            it('should set the killedIdVariable variable', testKilledIdVariableIsSet);

            it.todo('should not let combat continue until control is returned from the beforeDeathEvent');

            it.todo('should fire the afterDeathEvent after control is returned from the beforeDeathEvent');
        });
    });
});
